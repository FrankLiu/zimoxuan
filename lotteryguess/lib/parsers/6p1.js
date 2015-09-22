/**
 * TiCai 6+1 parser
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

var name = "6p1 lottery parser";

function Parser() {
    this.name = name;
    this._encoding = "utf-8";
}

/**
 * parse given content, and return history datas as array
 * the content is formated as http://datachart.500.com/dlc/zoushi/dlc_fb.shtml
 */ 
Parser.prototype.parse = function(opts, callbacks){
	console.log("Not supported yet!");
	
}

module.exports = Parser;

