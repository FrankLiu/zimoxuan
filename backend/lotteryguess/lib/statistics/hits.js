/**
 * JiangXi 11x5 statistics
 */

'use strict';

var _u = require('underscore'),
	_s = require('underscore.string');
var utils = require('../utils');

/**
 * do guess work based on history data statistics
 */
exports.hits = function(hisdatas, opts){
	var mappings = _u.object(hisdatas);
	//console.log(mappings);
	var guessNums = opts.guessNums || _u.first(opts._);
	if(!guessNums){
		console.log("No number provided for searching!");
	}
	var guessNumsArr = guessNums.split(',');
	var hnumsize = _u.size(guessNumsArr);
	var dif = opts.diffDeps;
	console.log("searching the hit numbers...");
	console.log("provider numbers: " + guessNums);
	console.log("diffrence depth: " + dif);
	
	var fuzzyHits = function(){
		//group the hitted nums
		var filterdata = 
		_u
		.chain(_u.values(mappings))
		.filter(function(it){
			//match arbitrary 4 nums or all of hotnums if given hotnums size < 4
			var intersector = (hnumsize-dif) <= 0 ? 0 : (hnumsize-dif);
			return _u.size(_u.intersection(guessNumsArr, it.split(','))) >= intersector;
			//return _u.size(_u.difference(guessNumsArr, it.split(','))) == 1;
			
			//below flagments to restrict the guess with all given hot nums
			// return _u.every(guessNumsArr, function(h){
				// return _s.include(it, h);
			// });
			
			//below flagments to restrict the guess with one of hot nums
			// return _u.some(guessNumsArr, function(h){
				// return _s.include(it, h);
			// });
		})
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
		console.log("hitted before:");
		console.log(filterdata._wrapped);
		console.log("total hitted data: " + _u.size(filterdata._wrapped));
		//console.log(_s.repeat('-', 50));
	}
	
	var accurateHits = function(){
		console.log("hitted before(%s): ", guessNums);
		utils.log('-',36);
		_u.each(mappings, function(v,k){
			if(_u.size(_u.difference(guessNumsArr, v.split(','))) == 0){
				console.log(_s.lrpad(k, 10, ' '), _s.lrpad(v, 16, ' '));
			}
		});
	}
	
	if(dif == 0){
		accurateHits();
	}
	else{
		fuzzyHits();
	}
};
