'use strict' 

let name = "The Window"; 
function pFunc(){
  this.name = "My Object";
  this.getNameFunc = function(cb){ 
    //var name = 'the name func';
	console.log(this);
	return function(){
		return cb();   //=>嵌套函数的this为全局变量或undefined，不会继承父函数的this
    }; 
  }
}; 

var p = new pFunc();
p.getNameFunc(function(){
	console.log('cb name: ', name);
}).bind(p)();

