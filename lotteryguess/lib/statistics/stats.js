/**
 * JiangXi 11x5 statistics
 */

'use strict';

function Stats(name) {
    this.name = name;
	//cache for store data
	this.cache = {};
}

Stats.prototype.set = function(key, value){
	this.cache[key] = value;
}

Stats.prototype.get = function(key){
	var element = this.cache[key];
    if (!element) { return; }
	return element;
}

Stats.prototype.remove = function (key) {
	var element = this.cache[key];
	if(element) {
		delete this.cache[key];
	}
	return element;
}

Stats.prototype.incSet = function(key){
	var element = this.get(key);
	if(!element){
		element = 0;
	}
	element++;
	this.set(key, element);
}

Stats.prototype.incGet = function(key){
	var element = this.get(key);
	if(!element){
		return 0;
	}
	return element;
}

exports = module.exports = Stats;
