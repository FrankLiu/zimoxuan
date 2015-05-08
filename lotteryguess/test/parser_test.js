var assert = require("assert")
var Parser = require("../lib/parsers/11x5");

var parser = new Parser();
parser.latest(20);
console.log('---------------------------');
parser.absence('03,05,06,09,11');


// describe('Parser', function(){
	// var parser = new Parser();
	// describe('constructor', function(){
		// it("should return Parser instance which contains prototype functions", function(){
			// assert.equal("11x5 lottery parser", parser._name);
			// assert.equal(Object.keys(parser.constructor.prototype).length, 5);
		// })
	// })
	
	// ,describe('absense', function(){
		// it("should extract the absense information", function(){
			// assert.ok(typeof parser.absence == 'function');
			// var result = parser.absence('03,05,06,09,11');
			// assert.equal(result.absence.length, 0);
		// })
	// })
	
	// ,describe('latest', function(){
		// it("should extract the latest numbers", function(){
			// assert.ok(typeof parser.latest == 'function');
			// parser.latest();
		// })
	// })
// })
