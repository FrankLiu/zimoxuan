/**
 * JiangXi 11x5 statistics
 */

'use strict';

var _u = require('underscore'),
	_s = require('underscore.string');
var async = require('async');

var Stats = require('./stats');

/**
 * do statistics work with history datas
 */
exports.groups = function(hisdatas, dif){
	var mappings = _u.object(hisdatas);
	//console.log(mappings);
	if(!dif) dif = 0;
	if(dif > 4) dif = 4;
	
	var stats = new Stats('groups');

	var groupdata = 
	_u.chain(_u.values(mappings))
	.sortBy(function(it){
		return _u.sortBy(it.split(','), function(num){
			return parseInt(num);
		}).join(',');
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
