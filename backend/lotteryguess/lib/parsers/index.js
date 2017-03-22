//下载,提取数据并更新至数据库
//数据库支持csv，sqlite3，redis

'use strict';

var Parser_11x5 = require('./11x5');
var Parser_6p1 = require('./6p1');

exports.types = {
	'11x5': '11x5',
	'6p1': '6p1'
};

exports.newParser = function(type){
	switch(type){
	case exports.types['11x5']:
		return new Parser_11x5();
		break;
	case exports.types['6p1']:
		return new Parser_6p1();
		break;
	default:
		console.error("Not supported type: " + type);
		process.exit(1);
	}
}



