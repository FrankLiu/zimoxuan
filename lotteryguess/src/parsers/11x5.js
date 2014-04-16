/**
 * JiangXi 11x5 parser
 */
//下载,提取数据并更新至数据库
//数据库支持csv，sqlite3，redis

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
var ABSENCE_URL = 'http://datachart.500.com/dlc/omit/inc/wmyl.php';
var LATESTDAYS_URL = 'http://datachart.500.com/dlc/zoushi/inc/dlc_fb.php?expect=';

module.exports = Parser;

function Parser() {
    this._name = NAME;
    this._encoding = DEFAULT_ENCODING;
}

//提取遗漏号码
Parser.prototype.absence = function(numbers){
	if(numbers instanceof String){
		numbers = numbers.split(/[ ,;|]+/);
	}
	if(!_u.isArray(numbers)){
		console.log("numbers should be an array!");
		return false;
	}
	
	var result = {'numbers':'', 'absence': []};
	numbers = numbers.join(' ');
	request.get(ABSENCE_URL, 
		{ /*encoding: 'gbk'*/ }, 
		function(error, resp, body){
			//console.log("Response Code: " + resp.statusCode);
			if (!error && resp.statusCode == 200) {
				//console.log(body); // Print the whole web page.
				
				//parse html and extract the records
				$ = cheerio.load(body);
				$('table[id="tdata"] > tr').slice(1).each(function(i, elem){
					var telem = $(elem).children();
					if(_u.isEqual(telem.first().text(), numbers)){
						console.log(numbers);
						result['numbers'] = numbers;
						telem.slice(5,4).each(function(i, e){
							console.log($(e).text());
							result['absence'].push($(e).text());
						});
					}
				});
			}
		}
	);
	return result;
}

//提取最新开奖号码
Parser.prototype.latest = function(duration){
	if(!duration || duration != 5 || duration != 3 || duration != 1){
		duration = 1;
	}
	var result = [];
	LATESTDAYS_URL += duration;
	request.get(LATESTDAYS_URL, 
		{
			//encoding: 'gbk'
		}, 
		function(error, resp, body){
			//console.log("Response Code: " + resp.statusCode);
			if (!error && resp.statusCode == 200) {
				//console.log(body); // Print the whole web page.
				
				//parse html and extract the records
				$ = cheerio.load(body);
				$('table[id="chartsTable"] > tbody > tr').slice(2).each(function(i, elem){
					var serialNo = $(elem).attr('id');
					var ballNums = $(elem).find('td[class="chartBall01"]/text()').join(' ');
					console.log(serialNo + '\t' + ballNums);
				});
				result.push({'serialNo': serialNo, 'ballnums': ballNums});
			}
		}
	);
	return result;
}

var getFilePath = function(pdays){
	var fpath;
	switch(pdays){
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
	var file = getFilePath(opts.pdays);
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
