'use strict';

var hits = require('./hits').hits,
	groups = require('./groups').groups;
	
exports = module.exports = {
	'hits': hits, 
	'groups': groups,
	'all': [hits, groups]
};

