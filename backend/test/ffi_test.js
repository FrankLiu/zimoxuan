var ffi = require('ffi');
 
var libm = ffi.Library('msvcrt', {
  'ceil': [ 'double', [ 'double' ] ]
});
console.log(libm.ceil(1.5)); // 2 
 
// You can also access just functions in the current process by passing a null 
var current = ffi.Library(null, {
  'atoi': [ 'int', [ 'string' ] ]
});
current.atoi('1234'); // 1234 

var WinRing = ffi.Library('./WinRing', {
	'getDllStatus': [ 'double', [] ] 
});