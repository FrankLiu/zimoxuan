﻿/**
 * JiangXi 11x5 parser
 */
'use strict';

var NAME = __filename;

var path = require('path'),
	fs 	 = require('fs');
	
var events = require("events"),
    util   = require("util");
	
var _u = require('underscore'),
	_s = require('underscore.string');

var request = require('request'), 
	cheerio = require('cheerio'),
	csv = require('csv');

var DEFAULT_ENCODING = "utf-8";
var NAME = "11x5 lottery parser";
var YL_BASE_URL = 'http://datachart.500.com/dlc/omit/inc';
var SMYL_URL = YL_BASE_URL + '/smyl.php';
var WMYL_URL = YL_BASE_URL + '/wmyl.php';
var LMYL_URL = YL_BASE_URL + '/lmyl.php';
var QMYL_URL = YL_BASE_URL + '/qmyl.php';
var BMYL_URL = YL_BASE_URL + '/bmyl.php';
var ZJ_HEADER = ['期号','开奖号码'];
var YL_HEADER = [
	'类型','出现次数','理论出现次数','出现频率','平均遗漏','最大遗漏',
	'上次遗漏','本次遗漏','欲出几率','回补几率','最大遗漏期间'
];
var LATESTDAYS_URL = 'http://datachart.500.com/dlc/zoushi/inc/dlc_fb.php?expect=';

module.exports = Parser;

function Parser() {
    this._name = NAME;
    this._encoding = DEFAULT_ENCODING;
}

var convertDuration2PeriodDays = function(duration){
	if(!duration || duration <= 5) return 1;
	if(duration > 5 && duration <= 78) return 1;
	if(duration > 78 && duration <= 234) return 3;
	if(duration > 234 && duration <= 390) return 5;
	return 5;
}

var formatOutput = function(arrs, lstlen, othlen, paddingstr){
	paddingstr = paddingstr || ' ';
	lstlen = lstlen || 12;
	var out = [];
	_u.each(arrs, function(el, i){
		//console.log("%s: %s", i, el);
		if(i == 0){ 
			out.push(_s.lrpad(el, lstlen, paddingstr));
		}
		else{
			othlen = othlen || (YL_HEADER[i].length + 2);
			//console.log("%d:length: %s", i, othlen);
			out.push(_s.lrpad(el, othlen, paddingstr));
		}
	});
	console.log(out.join(''));
}

//遗漏号码的字段名称
Parser.prototype.absenceHeader = function(){
	return YL_HEADER;
}

//提取遗漏号码
Parser.prototype.absence = function(numbers){
	var numsarray = [];
	//console.log(numbers);
	if(typeof numbers == "string"){
		numsarray = numbers.split(/[\s,;]+/);
	}
	if(_u.isArray(numbers)){
		numsarray = numbers;
	}
	
	var result = {'numbers':'', 'absence': []};
	numbers = numsarray.sort().join(' ');
	//console.log(numbers);
	
	if(_u.size(numsarray) == 4){
		var ylurl = SMYL_URL;
	}
	else{
		var ylurl = WMYL_URL;
	}
	
	request(ylurl, {encoding: this._encoding}, function(error, resp, data){
		//console.log("Response Code: " + resp.statusCode);
		if (!error && resp.statusCode == 200) {
			//console.log(data); // Print the whole web page.
			
			//parse html and extract the records
			var $ = cheerio.load(data);
			var trs = $('table[id=tdata] > tr');
			//console.log($('table[id=tdata] > tr ').children().length);
			
			//console.log(trs.first().find('td > a').length);
			//TODO: need to figure out the download stream encoding issue
			//_u.each(trs.first().find('td > a'), function(hr){
			//console.log( $(hr).text().trim() + '\t');
			//});
			formatOutput(YL_HEADER.slice(0,9));
			trs.slice(1).each(function(i, elem){
				var tds = $(elem).children();
				//console.log(tds.first().text());
				if(_u.isEqual(tds.first().text().trim(), numbers)){
					//console.log("find matched numbers: " + numbers);
					result['numbers'] = numbers;
					tds.slice(0,9).each(function(i, e){
						result['absence'].push($(e).text());
					});
					formatOutput(result['absence'],12,10);
				}
			});
		}
	});
}

//提取多组遗漏号码
Parser.prototype.absences = function(multi_numbers){
	_u.each(multi_numbers, function(numbers){
		this.absence(numbers);
	});
}

//提取最新开奖号码
Parser.prototype.latest = function(duration){
	var expect = convertDuration2PeriodDays(duration);
	LATESTDAYS_URL += expect;
	var result = [];
	request.get(LATESTDAYS_URL, {encoding: this._encoding }, 
		function(error, resp, body){
			//console.log("Response Code: " + resp.statusCode);
			if (!error && resp.statusCode == 200) {
				//console.log(body); // Print the whole web page.
				//parse html and extract the records
				var $ = cheerio.load(body);
				var trs = $('table[id="chartsTable"] > tbody > tr');
				formatOutput(ZJ_HEADER);
				trs.slice(2).each(function(i, elem){
					var serialNo = $(elem).attr('id');
					//console.log(serialNo);
					if(serialNo && serialNo != 't_sign'){ //ignored non serial number trs 
						var ballNums = [];
						$(elem).find('td.chartBall01').each(function(i, ball){
							ballNums.push($(ball).text());
						});
						formatOutput([serialNo, ballNums.join(',')]);
						result.push({'serialNo': serialNo, 'ballnums': ballNums});
					}
				});
			}
		}
	);
	return result;
}

var getFilePath = function(pdays){
	var fpath;
	switch(parseInt(pdays)){
		case 1:
			fpath = 'data/11x5/11pick5_latestday.txt';
			break;
		case 3:
			fpath = 'data/11x5/11pick5_latest3days.txt';
			break;
		case 5:
			fpath = 'data/11x5/11pick5_latest5days.txt';
			break;
		default:
			console.error("Period days should be [1,3,5]");
			throw new Error("Period days only support [1,3,5]");
	}
	return fpath;
};

var getTransformFile = function(file){
	return path.join(path.dirname(file), path.basename(file, '.txt')+'.out');
};

Parser.prototype.transform = function(file, transformedFile){
	var ftime = fs.statSync(file)['mtime'];
	if(fs.existsSync(transformedFile) && ftime <= fs.statSync(transformedFile)['mtime']){
		console.log("Transformed file is newer than original file, ignore transform");
		return;
	}
	
	//delete out-of-date transformed file
	if(fs.existsSync(transformedFile)){
		console.log("removed outdated transformed file: " + transformedFile);
		fs.unlinkSync(transformedFile);
	}
	
	//transform
	var input = fs.readFileSync(file, { encoding: 'utf-8'} );
	var lines = input.split(/\r?\n/);
	var output = "";
	for(var i=0,len=lines.length; i<len; i++){
		var line = lines[i];
		console.log(line);
		if(line){
			var records = line.split(/\s+/);
			if(records && records.length >= 3){
				output += records[1] + '\t' + records[2] + "\n";
			}
		}
	}
	fs.writeFileSync(transformedFile, output);
	console.log("Transformed file: [" + file + "] to [" + transformedFile + "]");
}

/**
 * parse given content, and return history datas as array
 * the content is formated as http://datachart.500.com/dlc/zoushi/dlc_fb.shtml
 */ 
Parser.prototype.parse = function(opts, callbacks){
	var hisdatas = [];
	var file = getFilePath(opts.periodDays);
	var transformedFile = getTransformFile(file);
	
	//check file exist
	if(!fs.existsSync(file)){
		console.log("File [" + file + " ] not exists, please download it from website!");
		process.exit(1);
	}
	
	//transform
	this.transform(file, transformedFile);
	
	//check transformed file exists
	if(!fs.existsSync(transformedFile)){
		console.error("Not found transformed file");
		process.exit(1);
	}
	
	csv()
	.from.path(transformedFile, {delimiter: "\t"})
	.to.array(function(data){
		//console.log(data);
	})
	.transform( function(row, index){
		//row.unshift(row.pop());
		return row;
	})
	.on('record', function(row,index){
		//console.log(JSON.stringify(row));
		hisdatas.push(row);
	})
	.on('end', function(count){
		//console.log(hisdatas);
		//invoke callback functions
		if(callbacks && _u.isArray(callbacks)){
			_u.each(callbacks, function(c){
				//console.log("invoked callback: " + c);
				if(_u.isFunction(c)){
					try{ c(hisdatas, opts); } 
					catch(e){ console.error(e); } 
				}
			});
		}
	})
	.on('error', function(error){
		console.log(error.message);
	});
}
