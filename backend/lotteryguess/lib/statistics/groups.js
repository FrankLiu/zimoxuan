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
exports.groups = function(hisdatas, opts){
	var mappings = _u.object(hisdatas);
	//console.log(mappings);
	var stats = new Stats('groups');
	
	//group by 4 numbers
	if(opts.groupBy == 4){
		var groupdata = 
		_u
		.chain(_u.values(mappings))
		.map(function(it){
			return _u.map(it.split(','), function(itn){
				return _u.without(it.split(','),itn).join(',');
			});
		})
		.flatten()
		.countBy(function(it){
			return _u.sortBy(it.split(','), function(num){
				return parseInt(num);
			}).join(',');
		})
		.filter(function(v,k){
			if(v>2){
				console.log("{%s: %s}", k, v);
				return "{%s: %s}", k, v
			}
		});
	}
	else{
		var groupdata = 
		_u
		.chain(_u.values(mappings))
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
	}
	console.log(groupdata);
	console.log("total data: " + _u.size(hisdatas));
	console.log("total group data: " + _u.size(groupdata._wrapped));
	console.log(_s.repeat('-', 50));
};
