//体彩猜猜猜
//该程序是一个用于猜体育彩票的简单工具
var NAME = __filename;
var SUMMAY = "::::  TiCai: %s  ::::";

var Parsers = require('./src/parsers');
var Statistics = require('./src/statistics');
var utils = require('./src/utils');
var program = require('commander');
var async = require('async');

function usage(){
	console.log("Usage: %s -h, --help", NAME);
	utils.exit(1);
}

function validateArgs(argv){
	console.log('validate options...');
	
	console.dir(argv);
	if(! argv.type in Parsers.types){
		usage();
	}
	
	if(argv.statistics == "hitnums" ||  argv.statistics == "all"){
		if(!argv.guessNums){
			console.log("guess nums is required for hitnums statistics");
			//utils.exit(1);
		}
		// async.series([
			// async.apply(utils.required, argv.guessNums, 'guess nums', usage),
			// async.apply(utils.requiredLength, argv.guessNums.split(','), 'guess nums', 4, program.help)
		// ]);
	}
	
	console.log('validate options passed');
}


function main(argv){
	console.log('-----------------------');
	console.log(SUMMAY, argv.type);
	console.log('-----------------------');
	console.log("Lottery type: " + argv.type);
	console.log("Execute program: %s", argv.action);
	console.log('-----------------------');
	
	if(argv.action == 'statistics'){
		console.log("parsing with "+argv.periodDays+" days data ...");
		validateArgs(argv);
		var parser = Parsers.newParser(argv.type);
		//console.dir(Statistics);
		switch(argv.statistics){
		case 'hitnums':
			parser.parse(argv, [Statistics.hitnums]);
			break;
		case 'groupnums':
			parser.parse(argv, [Statistics.groupnums]);
			break;
		case 'all':
			parser.parse(argv, Statistics.all);
			break;
		default:
			console.log("Supported hitnums|groupnums|all statistics now");
			break;
		}
	}
	else if(argv.action == 'latest'){
		var parser = Parsers.newParser(argv.type);
		parser.latest(argv.periodDays);
	}
	else if(argv.action == 'absence'){
		var parser = Parsers.newParser(argv.type);
		parser.absence(argv.guessNums);
	}
	else{
		console.log("supported actions: statistics|transform");
		process.exit(0);
	}
}

var argv = program
  .version('0.1.1')
  .option('-t, --type <11x5|6p1>', 'lottery type', '11x5')
  .option('-a, --action <statistics|latest|absence>', 'execute program', 'statistics')
  .option('-s, --statistics <hitnums|groupnums|all>', 'Statistics and Parsing', 'hitnums')
  .option('-p, --period-days <1,3,5>|<10-390>', 'period days <1,3,5> or qihao <10-390>', 1)
  .option('-g, --guess-nums [02,04,06,08,10]', 'at least 4 guess numbers')
  .option('-d, --diff-deps <n>', 'difference depth <1-5>', 1)
  .parse(process.argv);
main(argv);
