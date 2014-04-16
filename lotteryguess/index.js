//体彩猜猜猜
//该程序是一个用于猜体育彩票的简单工具
var NAME = __filename;
var SUMMAY = "TiCai: 11x5";

var Parsers = require('./src/parsers');
var Statistics = require('./src/statistics');

function parseOpts(){
	var optimist = require('optimist');
	var argv = optimist
			.options('h', { alias : 'hnums', describe: 'at least 4 hot numbers', required: true})
			.options('d', { alias : 'dif', describe: 'difference depth', default: 1})
			.options('p', { alias : 'pdays', describe: 'period days [1,3,5]', default: 1})
			.options('t', { alias : 'type', describe: 'lottery type', default: '11x5'})
			.options('s', { alias : 'statistics', describe: 'lottery statistics', default: 'hitnums'})
			.usage("This is a caipiao program")
			.argv;
	
	if(!argv.hnums || argv.hnums.toString().split(',').length < 4){
		optimist.showHelp();
		process.exit(1);
	}
	return argv;
}

function print_header(){
	console.log('-----------------------');
	console.log('::: ' + SUMMAY + ' :::');
	console.log('-----------------------');
}

function main(opts){
	print_header();	
	console.log("parsing with "+opts.pdays+" days data ...");
	console.log("type: " + opts.type);
	if(! opts.type in Parsers.types){
		console.log("type not found: " + opts.type);
		process.exit(1);
	}
	var parser = Parsers.newParser(opts.type);
	//console.dir(Statistics);
	switch(opts.statistics){
	case 'hitnums':
		parser.parse(opts, [Statistics.hitnums]);
		break;
	case 'groupnums':
		parser.parse(opts, [Statistics.groupnums]);
		break;
	case 'all':
		parser.parse(opts, [Statistics.hitnums, Statistics.groupnums]);
		break;
	default:
		console.log("Supported hitnums|groupnums statistics now");
		break;
	}
}

main(parseOpts());
