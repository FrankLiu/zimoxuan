/**
 * JiangXi 11x5 statistics
 */

//'use strict';

var _u = require('underscore'),
	_s = require('underscore.string');

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

exports.pad = function(str, len, padstr){
	if(!_s.contains(str, ",")){
		return _s.pad(str, len, padstr);
	}
	
	return _u.map(str.split(","), function(num){
			return _s.pad(num, len, padstr);
		})
		.join(",");
	
};

exports.padZero = function(str, len){
	return exports.pad(str, len, '0');
};

// https://github.com/loopj/commonjs-ansi-color/blob/master/lib/ansi-color.js
var ANSI_CODES = {
  'fail': 31, // red
  'error': 31, // red
  'pass': 32, // green
  'info': 37 // white
}

function color(str, type) {
  return '\033[' +
      (ANSI_CODES[type] || ANSI_CODES['info']) + 'm  '
      + str + '\033[0m'
}
exports.colorlog = function(str, c){
	console.log(color(str, c));
};

exports.errorlog = function(str){
	exports.colorlog(str, ANSI_CODES['error']);
};
