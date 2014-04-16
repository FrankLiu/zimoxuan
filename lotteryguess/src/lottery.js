//体彩猜猜猜
//该程序是一个用于猜体育彩票的简单工具

'use strict';

var NAME = __filename;

// Nodejs libs.
var path = require('path'),
	fs 	 = require('fs');
	
var _u = require('underscore'),
	_s = require('underscore.string'),
	request = require('request'), 
	cheerio = require('cheerio'),
	csv = require('csv');
	
var async = require('async');

var store = require('./store');
var parser_factory = require('./parsers');

// The module to be exported.
//module.exports = exports = l;
var l = module.exports = exports = {};

l.version = "0.1.10";

l.options = {
	cached: true, //cache data locally
	datadir: 'data', //data cache dir
	dbstr: './data/lottery.db',
	queryurl: 'http://www.zjlottery.com/win/SResult.asp'
};

//set lottery type
l.settype = function(type){
	this.type = type;
};
//set lottery description
l.setdesc = function(description){
	this.description = description;
};
//set query parameters
l.setparams = function(params){
	this.params = params;
};

//get local file name by given date
l.getfilename = function(sdate){
	return lottery.options.datadir + '/' + this.type + '_' + sdate.replace(/-/g,'') + '.html';
};

function prepare_datadir(){
	if(!fs.existsSync(lottery.options.datadir)){
		console.log("Data cache dir [" + lottery.options.datadir + " ] not exists, create it!");
		fs.mkdirSync(lottery.options.datadir);
	}
}

function invoke_callbacks(hisdatas, callbacks, hotnums){
	//invoke callback functions
	if(callbacks && _u.isArray(callbacks)){
		_u.each(callbacks, function(c){
			//console.log("invoked callback: " + c);
			if(_u.isFunction(c)){
				try{ c(hisdatas, hotnums); } 
				catch(e){ console.error(e); } 
			}
		});
	}
}

/**
 * load html content, either load it from website or local, and invoke callback functions
 */ 
l.load = function(sdate, callbacks){
	prepare_datadir();
	var filename = lottery.getfilename(sdate);
	if(fs.existsSync(filename)){
		console.log("File [" + filename + " ] exists, load it from local!");
		console.log('--------------------------'+ sdate + '---------------------');
		var hisdatas = lottery.parse(fs.readFileSync(filename));
		invoke_callbacks(hisdatas, callbacks);
	}
	else{
		console.log("File [" + filename + " ] not exists, request from website and cache it locally!");
		var params = _u.extend(this.params, {'Sdate': sdate});
		console.log("send request with data: " + JSON.stringify(params));
		request.post(lottery.options.queryurl, {
				//encoding: 'gbk',
				form: params
			}, 
			function(error, resp, body){
				//console.log("Response Code: " + resp.statusCode);
				if (!error && resp.statusCode == 200) {
					//console.log(body); // Print the whole web page.
					
					//cache it locally
					if(lottery.options.cached){
						console.log("File [" + filename + " ] not exists, create it!");
						fs.writeFileSync(filename, body, {encoding: 'utf8'});
					}
					
					console.log('--------------------------'+ sdate + '---------------------');
					var hisdatas = lottery.parse(body);
					invoke_callbacks(hisdatas, callbacks);
				}
			}
		);
	}
};

//load a range of results, merge them then do statistics & guess
l.loadrange = function(sdaterange, callbacks){
	prepare_datadir();
	async.map(sdaterange, lottery.load.bind(lottery), function(err, results){
		if(err){
			console.error("Error: " + err);
			throw new Error(err);
		}
		invoke_callbacks(results, callbacks);
	});
};

/**
 * parse given html content, and return history datas as array
 *  the content is formated as http://www.zjlottery.com
 */
l.parse = function(html){
	var hisdatas = [];
	var $ = cheerio.load(html);
	$('table.tb1 > tr').slice(1).each(function(i, elem){
		var row = '';
		$(elem).find('td').each(function(j, eltd){
			row += $(eltd).text() + '\t';
			if(j == 3){
				hisdatas.push($(eltd).text());
			}
		});
		console.log(row);
	});
	//console.log(JSON.stringify(hisdatas));
	return hisdatas;
}; 

/**
 * do statistics work with history datas
 */
l.statistics = function(hisdatas, hotnums){
	var mappings = _u.object(hisdatas);
	//console.log(mappings);
	var groupdata = 
	_u.chain(_u.keys(mappings))
	.sortBy(function(it){
		return _u.sortBy(it.split(','), function(num){
			return parseInt(num);
		}).join(',') 
	})
	.groupBy(function(it){
		return _u.sortBy(it.split(','), function(num){
				return parseInt(num);
			}).join(',');
	});
	console.log(groupdata);
	console.log("total data: " + _u.size(hisdatas));
	console.log("total group data: " + _u.size(groupdata._wrapped));
	console.log(_s.repeat('-', 50));
};
