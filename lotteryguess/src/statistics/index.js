'use strict';

var hitnums = require('./hitnums').hitnums,
	groupnums = require('./groupnums').groupnums;
	
module.exports = {
	'hitnums': hitnums, 
	'groupnums': groupnums,
	'all': [hitnums, groupnums]
};

