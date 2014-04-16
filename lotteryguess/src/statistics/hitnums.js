/**
 * JiangXi 11x5 statistics
 */

'use strict';

var _u = require('underscore'),
	_s = require('underscore.string');
var async = require('async');
	
/**
 * do guess work based on history data statistics
 */
exports.run = function(hisdatas, opts){
	var mappings = _u.object(hisdatas);
	//console.log(mappings);
	var hnums = opts.hnums || _u.first(opts._);
	if(!hnums){
		console.log("No hot nums provided!");
	}
	var hotnumsarr = hnums.split(',');
	var hnumsize = _u.size(hotnumsarr);
	var dif = opts.dif;
	console.log("starting guess the next nums...");
	console.log("hot nums: " + hnums);
	console.log("diffrence depth: " + dif);
	
	//group the hitted nums
	var filterdata = 
	_u.chain(_u.values(mappings))
	.filter(function(it){
		// var sortedit = _u.sortBy(it.split(','), function(num){
			// return parseInt(num);
		// }).join(',');
		
		//match arbitrary 4 nums or all of hotnums if given hotnums size < 4
		var intersector = (hnumsize-dif) <= 0 ? 0 : (hnumsize-dif);
		return _u.size(_u.intersection(hotnumsarr, it.split(','))) >= intersector;
		//return _u.size(_u.difference(hotnumsarr, it.split(','))) == 1;
		
		//below flagments to restrict the guess with all given hot nums
		// return _u.every(hotnumsarr, function(h){
			// return _s.include(it, h);
		// });
		
		//below flagments to restrict the guess with one of hot nums
		// return _u.some(hotnumsarr, function(h){
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
	
	//guess the next nums from the hitted nums
	//console.log("hitted and guess:");
	var hguessdata = _u.chain(_u.values(filterdata._wrapped))
	.filter(function(it){
		//restrict the guess with no-frequence hotnums and more frequence hotnums
		return _u.size(it) <= 1; //|| _u.size(it) >= 6;
	})
	.flatten()
	.groupBy(function(it){
		return _u.sortBy(it.split(','), function(num){
				return parseInt(num);
			}).join(',');
	});
	//console.log(_u.keys(hguessdata._wrapped));
	//console.log(hguessdata);
	//console.log("total hitted and guessed data: " + _u.size(hguessdata._wrapped));
	
	//put the result into redis for cache
	// _u.each(_u.keys(hguessdata._wrapped), function(it){
		// client.sismember('guessset', it, function(err, res){
			// if(!res) client.sadd('guessset', it);
		// });
	// });
	
	//guess the next nums based on hitted nums & intelligence algorithm
	console.log('guess the next nums:');
	async.waterfall([ 
		function(callback){
			// client.smembers('guessset', function(err, replics){
				// callback(null, replics);
			// });
			// client.end();
		},
		function(guessdata, callback){
			console.log(guessdata);
			console.log("total guessed data: " + _u.size(guessdata));
			callback(null, 'done');
		}
	], function (err, result) {
		if(err){
			console.error(err.message);
		}
		console.log(result);
		// result now equals 'done'    
	});
	console.log(_s.repeat('-', 50));
};
