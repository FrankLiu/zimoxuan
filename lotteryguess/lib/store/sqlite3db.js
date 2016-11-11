'use strict';

var NAME = __filename;

var _u = require('underscore'),
	_s = require('underscore.string');

var csv = require('csv');
var sqlite3 = require('sqlite3').verbose();

var default_options = {
	'cache': false,
	'dbstr': './data/lottery.db',
};

var createDB = function(){
	console.log("create lottery tables...");
	this.db.serialize(function() {
		//initialize lottery_11x5 table
		this.db.run("CREATE TABLE IF NOT EXISTS jx11x5( \
			id int(11) not null description serial number, \
			numbers varchar(30) not null, \
			sorted_numbers varchar(30) not null, \
			desc text, \
			primary key (id) \
			)");
	});
};

// The module to be exported.
var Sqlite3DB = function(options){
	this.options = _u.extends(
		default_options,
		options
	);
	this.db = new sqlite3.Database(this.options.dbstr);
};

Sqlite3DB.prototype.createTables = function(){
	createDB();
}

Sqlite3DB.prototype.execute = function(sql, sqlparams, cb){
	console.log("execute sql: " + sql);
	this.db.serialize(function() {
		var stmt = db.prepare(sql);
		db.run("BEGIN");
		stmt.run(sqlparams);
		stmt.finalize(cb);
		db.run("COMMIT");
	});
};

Sqlite3DB.prototype.query = function(sql, sqlparams, cb){
	console.log("execute query sql: " + sql);
	this.db.prepare(sql, sqlparams)
		   .all(function(err, rows) {
				cb(err, rows);
		   })
		   .finalize();
};

Sqlite3DB.prototype.close = function(){
	console.log("close lottery db");
	this.db.close();
};

exports.load = function(options){
	return new Sqlite3DB(options);
}

