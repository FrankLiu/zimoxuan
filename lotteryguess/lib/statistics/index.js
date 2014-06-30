'use strict';

var hits = require('./hits').hits,
	groups = require('./groups').groups,
	counts = require('./counts').counts;
	
exports = module.exports = {
	'hits': hits, 
	'groups': groups,
	'counts': counts,
	'all': [hits, groups]
};

