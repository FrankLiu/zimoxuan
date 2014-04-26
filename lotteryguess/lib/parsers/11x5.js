/**
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

var utils = require('../utils');

var DEFAULT_ENCODING = "utf-8";
var NAME = "11x5 lottery parser";
var LATESTDAYS_URL = 'http://datachart.500.com/dlc/zoushi/inc/dlc_fb.php?expect=';
var YL_BASE_URL = 'http://datachart.500.com/dlc/omit/inc';
var yl_types = {
	smyl: YL_BASE_URL + '/smyl.php',
	wmyl: YL_BASE_URL + '/wmyl.php',
	lmyl: YL_BASE_URL + '/lmyl.php',
	qmyl: YL_BASE_URL + '/qmyl.php',
	bmyl: YL_BASE_URL + '/bmyl.php'
};
var KJ_HEADER = ['期号','开奖号码'];
var YL_HEADER = [
	'类型','出现次数','理论出现次数','出现频率','平均遗漏','最大遗漏',
	'上次遗漏','本次遗漏','欲出几率','回补几率','最大遗漏期间'
];

var sortBys = {
	code: 'at=code&cha=asc&select=%C8%AB%B2%BF',
	cxcs: 'at=cxcs&cha=desc&select=%C8%AB%B2%BF',
	bcyl: 'at=bcyl&cha=desc&select=%C8%AB%B2%BF',
	ycjl: 'at=ycjl&cha=desc&select=%C8%AB%B2%BF'
};
var default_yl_len = 30;

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

var convertGuessNums2Url = function(guessNums){
	var size = 5;
	if(typeof guessNums == "string"){
		size = _u.size(guessNums.split(/[\s,;]+/));
	}
	else{
		size = _u.size(guessNums);
	}
	//console.log("absence url: %s", getUrlByYLType(size));
	return getUrlByYLType(size);
}

var getUrlByYLType = function(yltype){
	switch(yltype){
	case 4:
		return yl_types.smyl;
	case 5:
		return yl_types.wmyl;
	case 6:
		return yl_types.lmyl;
	case 7:
		return yl_types.qmyl;
	case 8:
		return yl_types.bmyl;
	default:
		return yl_types.wmyl;
	}
}

var getParamsBySortType = function(sortType){
	switch(sortType){
	case "code":
		return sortBys.code;
	case "cxcs":
		return sortBys.cxcs;
	case "bcyl":
		return sortBys.bcyl;
	case "ycjl":
		return sortBys.ycjl;
	default:
		return sortBys.code;
	}
}

var renderKJResults = function(results){
	//utils.log('-', 30);
	formatOutput(KJ_HEADER);
	utils.log('-', 30);
	_u.each(results, function(result, i){
		formatOutput(result,12,16);
	});
	utils.log('-', 30);
	console.log('Total numbers: %d', _u.size(results));
}

var renderYLResults = function(results){
	//utils.log('-', 100);
	formatOutput(YL_HEADER.slice(0,9));
	utils.log('-', 100);
	_u.each(results, function(result, i){
		formatOutput(result,12,10);
	});
	utils.log('-', 100);
	console.log('Total numbers: %d', _u.size(results));
	console.log();
}

function Parser() {
    this._name = NAME;
    this._encoding = DEFAULT_ENCODING;
}

//遗漏号码的字段名称
Parser.prototype.absenceHeader = function(){
	return YL_HEADER;
}

//提取遗漏号码
Parser.prototype.absence = function(numbers){
	var numsarray = [];
	console.log("numbers: %s", numbers);
	//console.log("typeof number: %s", (toString.call(numbers)));
	if(_u.isString(numbers)){
		numsarray = numbers.split(/[\s,;]+/);
	}
	if(_u.isArray(numbers)){
		numsarray = _u.clone(numbers);
		//console.log('number is array: %s', numsarray);
	}
	
	var numbstr = numsarray.join(' ');
	//console.log("numb as string: %s", numbstr);
	
	var ylurl = convertGuessNums2Url(numbstr);
	console.log("load absences with url: %s", ylurl);
	request(ylurl, {encoding: DEFAULT_ENCODING}, function(error, resp, data){
		var results = {};
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
			
			//extract results
			trs.slice(1).each(function(i, elem){
				var result = [];
				var tds = $(elem).children();
				if(_u.isEqual(tds.first().text().trim(), numbstr)){
					console.log("find matched numbers: " + numbstr);
					tds.slice(0,9).each(function(i, e){
						result.push($(e).text());
					});
					results[numbstr] = result;
				}
			});
		}
		
		//print out results
		renderYLResults(_u.values(results));
	});
}

//提取多组遗漏号码
Parser.prototype.absences = function(sortBy, yltype, yllen){
	sortBy = sortBy || "code";
	yltype = yltype || "wmyl";
	yllen = yllen || default_yl_len;
	var urlbase = getUrlByYLType(yltype);
	var params = getParamsBySortType(sortBy);
	var ylurl = urlbase + "?" + params;
	//console.log("load absences with url: %s", ylurl);
	request(ylurl, {encoding: DEFAULT_ENCODING}, function(error, resp, data){
		var results = {};
		//console.log("Response Code: " + resp.statusCode);
		if (!error && resp.statusCode == 200) {
			//console.log(data); // Print the whole web page.
			
			//parse html and extract the records
			var $ = cheerio.load(data);
			var trs = $('table[id=tdata] > tr');
			//formatOutput(YL_HEADER.slice(0,9));
			
			//extract results
			trs.slice(1).each(function(i, elem){
				var result = [];
				var tds = $(elem).children();
				//console.log(tds.first().text());
				tds.slice(0,9).each(function(i, e){
					result.push($(e).text());
				});
				//add to results
				results[tds.first().text()] = result;
			});
		}
		
		//print out results
		var res = _u.values(results);
		if(sortBy != "code"){
			res = _u.initial(res, _u.size(res)-yllen);
		}
		renderYLResults(res);
	});
}

//提取最新开奖号码
Parser.prototype.latest = function(duration, callback){
	var expect = convertDuration2PeriodDays(duration);
	LATESTDAYS_URL += expect;
	
	request.get(LATESTDAYS_URL, {encoding: DEFAULT_ENCODING }, 
		function(error, resp, body){
			var results = {};
			//console.log("Response Code: " + resp.statusCode);
			if (!error && resp.statusCode == 200) {
				//console.log(body); // Print the whole web page.
				//parse html and extract the records
				var $ = cheerio.load(body);
				var trs = $('table[id="chartsTable"] > tbody > tr');
				//formatOutput(KJ_HEADER);
				trs.slice(2).each(function(i, elem){
					var result = [];
					var serialNo = $(elem).attr('id');
					//console.log(serialNo);
					if(serialNo && serialNo != 't_sign'){ //ignored non serial number trs 
						var ballNums = [];
						$(elem).find('td.chartBall01').each(function(i, ball){
							ballNums.push($(ball).text());
						});
						//formatOutput([serialNo, ballNums.join(',')]);
						//result.push({'serialNo': serialNo, 'ballnums': ballNums});
						result.push(serialNo);
						result.push(ballNums.join(','));
						results[serialNo] = result;
					}
				});
			}
			
			if(duration >= 10){
				results = _u.values(results).splice(-duration);
			}
			renderKJResults(results);
			if(callback && typeof callback == 'function'){
				callback(result);
			}
		}
	);
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

module.exports = Parser;
