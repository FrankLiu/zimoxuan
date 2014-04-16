var assert = require("assert")
var Parser = require("../src/parsers/11x5");

describe('Parser', function(){
	describe('constructor', function(){
		it("should return Parser instance which contains prototype functions", function(){
			var p = new Parser();
			assert.equal("11x5 lottery parser", p._name);
			assert.equal(Object.keys(p.constructor.prototype).length, 4);
		})
	})
})
