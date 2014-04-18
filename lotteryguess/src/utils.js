/**
 * JiangXi 11x5 statistics
 */

'use strict';

exports.required = function(arg, argName, cb){
	if(!arg){
		console.log("Input [%s] is required", argName);
		if(cb instanceof Function){
			cb(argName);
		}
		return false;
	}
	return true;
}

exports.requiredLength = function(arg, argName, length){
	if(!arg || arg.length < length){
		console.log("Input [%s] is required and length greater than %d", argName, length);
		return false;
	}
	return true;
}

