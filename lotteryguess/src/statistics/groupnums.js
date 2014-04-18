/**
 * JiangXi 11x5 statistics
 */

'use strict';

var desc = "Do statistics with group nums";
var _u = require('underscore'),
	_s = require('underscore.string');
var async = require('async');
	
/**
 * do statistics work with history datas
 */
exports.groupnums = function(hisdatas, opts){
	console.log(desc);
	var mappings = _u.object(hisdatas);
	//console.log(mappings);
	var hnums = opts.hnums || _u.first(opts._);
	if(!hnums){
		console.log("No hot nums provided!");
	}
	
	var groupdata = 
	_u.chain(_u.values(mappings))
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
