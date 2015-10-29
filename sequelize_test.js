var util = require('util');
var _ = require('underscore');
var Sequelize = require('sequelize');
var DEFAULT_CONFIG = {
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
};

var ORM = function(dburl, opts){
	opts = _.extend({}, opts, DEFAULT_CONFIG);
	Sequelize.call(this, dburl, opts);
}
util.inherits(ORM, Sequelize);
_.extend(ORM, Sequelize);

var orm = new Sequelize('mysql://root:123456@localhost:3306/asto_ec_origin');
console.log(ORM);

var User = orm.define('user', {
  firstName: {
    type: ORM.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: ORM.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
})
;

_.delay(function(){
	User.findAll().then(function (user) {
		console.log(user);
		console.log(user[0].dataValues.firstName, user.lastName);
	});
}, 5000);


