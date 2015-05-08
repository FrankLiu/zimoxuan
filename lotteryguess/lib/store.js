'use strict';

var NAME = __filename;

var _u = require('underscore'),
	_s = require('underscore.string');

var csv = require('csv');
var sqlite3 = require('sqlite3').verbose();
// var redis = require('redis'),
	// client = redis.createClient();
	
var default_options = {
	'cache': false,
	'dbstr': './data/lottery.db',
};

// The module to be exported.
var Store = function(dbstr, options){
	this.options = _u.extends(
		options,
		default_options
	);
	this.dbstr = dbstr || this.options.dbstr;
	this.db = new sqlite3.Database(this.dbstr);
};

Store.prototype.use = function(dbstr){
	console.log("switch lottery db to: " + dbstr);
	this.dbstr = dbstr;
	if(this.db) delete this.db;
	this.db = new sqlite3.Database(this.dbstr);
};

Store.prototype.createdb = function(){
	console.log("create lottery tables...");
	this.db.serialize(function() {
		//initialize lottery_11x5 table
		this.db.run("CREATE TABLE IF NOT EXISTS lottery_11x5( \
			id int(11) not null auto_increment, \
			serial_number int(11) not null, \
			choose_numbers varchar(30) not null, \
			desc text, \
			primary key (id) \
			)");
		
		//initialize lottery_11x5_guess table
		this.db.run("CREATE TABLE IF NOT EXISTS lottery_11x5_guess ( \
			id int(11) not null auto_increment, \
			guess_numbers varchar(30) not null, \
			desc text, \
			primary key (id) \
			)");
	});
};

Store.prototype.execute = function(sql, sqlparams, cb){
	console.log("execute sql: " + sql);
	this.db.serialize(function() {
		var stmt = db.prepare(sql);
		db.run("BEGIN");
		stmt.run(sqlparams);
		stmt.finalize(cb);
		db.run("COMMIT");
	});
};

Store.prototype.query = function(sql, sqlparams, cb){
	console.log("execute query sql: " + sql);
	this.db.prepare(sql, sqlparams)
		   .all(function(err, rows) {
				cb(err, rows);
		   })
		   .finalize();
};

Store.prototype.close = function(){
	console.log("close lottery db");
	this.db.close();
};

exports.create = function(dbstr, options){
	return new Store(dbstr, options);
}

