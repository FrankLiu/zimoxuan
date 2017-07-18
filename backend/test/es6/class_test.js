var Class = require('./class').Class;

var Person = Class.create({
  initialize: function(isDancing){
    this.dancing = isDancing;
  }
});
 
var Ninja = Person.create({
  initialize: function(){
    this._super( false );
  }
});
 
var p = new Person(true);
console.log(p.dancing); // => true
 
var n = new Ninja();
console.log(n.dancing); // => false

