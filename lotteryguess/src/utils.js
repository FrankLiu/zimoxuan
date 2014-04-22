/**
 * JiangXi 11x5 statistics
 */

'use strict';

// This seems to be required in Windows (as of Node.js 0.8.7) to ensure that
// stdout/stderr are flushed before the process exits.
exports.exit = function(exitCode) {
  if (process.stdout._pendingWriteReqs || process.stderr._pendingWriteReqs) {
    process.nextTick(function() {
      exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
};

exports.required = function(arg, argName, cb){
	if(!arg){
		console.log("Input [%s] is required", argName);
		if(cb && typeof cb == 'function'){
			cb(argName);
		}
		return false;
	}
	return true;
};

exports.requiredLength = function(arg, argName, length, cb){
	if(!arg || arg.length < length){
		console.log("Input [%s] is required and length greater than %d", argName, length);
		if(cb && typeof cb == 'function'){
			cb(argName, length);
		}
		return false;
	}
	return true;
};

