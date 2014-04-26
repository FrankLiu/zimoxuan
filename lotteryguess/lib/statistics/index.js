'use strict';

var hits = require('./hits').hits,
	groups = require('./groups').groups;
	
module.exports = {
	'hits': hits, 
	'groups': groups,
	'all': [hits, groups]
};

