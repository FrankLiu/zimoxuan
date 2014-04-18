//体彩猜猜猜
//该程序是一个用于猜体育彩票的简单工具
var NAME = __filename;
var SUMMAY = "TiCai: 11x5";

var Parsers = require('./src/parsers');
var Statistics = require('./src/statistics');
var utils = require('./src/utils');
var program = require('commander');

function print_header(){
	console.log('-----------------------');
	console.log('::: ' + SUMMAY + ' :::');
	console.log('-----------------------');
}

function validateArgs(argv){
	var result = false;
	var exitcb = function(){
		console.log("Usage: %s --help", NAME);
		process.exit(1);
	};
	utils.required(argv.statistics, 'statistics', exitcb);
	if(argv.statistics == "hitnums" ||  argv.statistics == "all"){
		utils.required(argv.guessNums, 'guess nums', exitcb);
		utils.requiredLength(argv.guessNums.split(','), 'guess nums', 4, exitcb);
	}
	
	result = utils.required(argv.type, 'lottery type', exitcb);
	if(result && ! argv.type in Parsers.types){
		console.log("type is invalid: " + argv.type);
		result = false;
	}
	
	if(!result){
		exitcb();
	}
}


function main(opts){
	print_header();
	console.log("parsing with "+opts.periodDays+" days data ...");
	console.log("type: " + opts.type);
	
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
		parser.parse(opts, Statistics.all);
		break;
	default:
		console.log("Supported hitnums|groupnums|all statistics now");
		break;
	}
}

var argv = program
  .version('0.0.1')
  .option('-s, --statistics <hitnums|groupnums|all>', 'Statistics and Parsing', 'hitnums')
  .option('-p, --period-days <1,3,5>', 'period days <1,3,5>', 1)
  .option('-g, --guess-nums <02,04,06,08,10>', 'at least 4 guess numbers')
  .option('-d, --diff-deps <n>', 'difference depth <1-5>', 1)
  .option('-t, --type <11x5|6p1>', 'lottery type', '11x5')
  .parse(process.argv);
//console.dir(argv);
validateArgs(argv);
main(argv);
