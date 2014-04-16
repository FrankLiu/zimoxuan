//体彩猜猜猜
//该程序是一个用于猜体育彩票的简单工具
var NAME = __filename;
var SUMMAY = "TiCai: 11x5";

var Parsers = require('./src/parsers');
var Statistics = require('./src/statistics/hitnums');

function parseOpts(){
	var optimist = require('optimist');
	var argv = optimist
			.options('h', { alias : 'hnums', describe: 'at least 4 hot numbers', required: true})
			.options('d', { alias : 'dif', describe: 'difference depth', default: 1})
			.options('p', { alias : 'pdays', describe: 'period days [1,3,5]', default: 1})
			.options('t', { alias : 'type', describe: 'lottery type', default: '11x5'})
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
	parser.parse(opts, [Statistics.run]);
}

main(parseOpts());
