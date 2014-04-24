/**
 * JiangXi 11x5 statistics
 */

'use strict';

// This seems to be required in Windows (as of Node.js 0.8.7) to ensure that
// stdout/stderr are flushed before the process exits.
exports.exit = function(exitCode) {
	//console.log("stdout: %s" + console.dir(process.stdout));
	//console.log("stderr: " + process.stderr);
	process.on('exit', function() {
		process.exit(exitCode);
	});
};

//fixed the asynchronized issue in Windows
//process.stderr and process.stdout are unlike other streams in Node in that writes to them are usually blocking.

// They are blocking in the case that they refer to regular files or TTY file descriptors.
// In the case they refer to pipes:
// 	They are blocking in Linux/Unix.
// 	They are non-blocking like other streams in Windows.

exports.exit2 = function(exitCode){
    setTimeout(function(){
		process.exit(exitCode);
	}, 10);
}

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

