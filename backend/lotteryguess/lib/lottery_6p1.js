//体彩猜猜猜
//该程序是一个用于猜体育彩票的简单工具
var LOTTERY_QUERY_URL = 'jkl;\win/SResult.asp';
var QUERY_PARAM_TYPE = 'flag';
var QUERY_PARAM_Sissue = 'Sissue';
var QUERY_PARAM_Eissue = 'Eissue';
var QUERY_PARAM_PAGE = 'page';
var LOTTERY_TYPES = ['1', 'L', 'P', 'W', 'C', 'E', '6', '3', 'F', 'H'];
//体彩6+1数字型
var LOTTERY_TYPE_6PLUS1 = LOTTERY_TYPES[0];
//体彩超级大乐透
var LOTTERY_TYPE_CJDLT = LOTTERY_TYPES[1];
//体彩生肖jkl;\乐(12选2)
var LOTTERY_TYPE_SXL = LOTTERY_TYPES[2];
//泳坛夺金
var LOTTERY_TYPE_YTDJ = LOTTERY_TYPES[3];
//体彩排列3
var LOTTERY_TYPE_TCPL3 = LOTTERY_TYPES[4];
//体彩排列5
var LOTTERY_TYPE_TCPL5 = LOTTERY_TYPES[5];
//体彩20选5乐透型
var LOTTERY_TYPE_20SEL5 = LOTTERY_TYPES[6];
//足彩胜负游戏
var LOTTERY_TYPE_ZCSF = LOTTERY_TYPES[7];
//足彩6场半全场胜负
var LOTTERY_TYPE_ZC6 = LOTTERY_TYPES[8];
//足彩4场进球游戏
var LOTTERY_TYPE_ZC4 = LOTTERY_TYPES[9];

var http = require('http');
var url = require('url');
var connect = require('connect');
var html5 = require('html5');
var Script = process.binding('evals').Script;
var jsdom = require('jsdom');
var window = jsdom.jsdom(null, null, {parser: html5}).createWindow();
var parser = new html5.Parser({document: window.document});
var encoding = 'gbk';

var options = url.parse(LOTTERY_QUERY_URL+'?flag=1&Sissue=12001&Eissue=12084&page=1');
console.log(options);
var req = http.request(options);
req.on('error', function(e) {
  console.log("Got error: " + e.message);
});
req.on('response', function(res){
	console.log('STATUS: ' + res.statusCode);
	console.log('HTTP Version: ' + res.httpVersion);
	console.log('HEADERS: ' + JSON.stringify(res.headers));
	res.setEncoding(encoding);
	var data;
	res.on('data', function (chunk) {
		data += chunk.toString(encoding);
	});
	console.log('BODY: ' + data);
	parser.parse(data);
});
req.end();
