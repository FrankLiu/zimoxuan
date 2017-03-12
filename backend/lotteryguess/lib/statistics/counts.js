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
exports.counts = function(hisdatas, opts){
	var mappings = _u.object(hisdatas);
	//console.log(mappings);

	//count by number
	var countdata = 
	_u
	.chain(_u.values(mappings))
	.map(function(it){
		return it.split(',')
	})
	.flatten()
	.sortBy(function(it){
		return parseInt(it);
	})
	.countBy(function(it){
		return _u.sortBy(it.split(','), function(num){
			return parseInt(num);
		}).join(',');
	});
	console.log(countdata._wrapped);
	console.log(_s.repeat('-', 50));
};
