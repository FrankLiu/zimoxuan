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

exports.log = function(str, times){
	var origstr = str;
	if(times && times > 1){
		for(var i=0; i<times; i++){
			str = str.concat(origstr);
		}
	}
	console.log(str);
}

exports.required = function(arg, argName){
	if(!arg){
		console.log("[%s] is required!", argName);
		return false;
	}
	return true;
};

exports.requiredLength = function(arg, argName, length){
	if(!arg || arg.length < length){
		console.log("[%s] is required and length should >= %d", argName, length);
		return false;
	}
	return true;
};

