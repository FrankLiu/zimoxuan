var util = require('util');
var _ = require('underscore');
var Sequelize = require('sequelize');

var CONNECTION_URL = 'mysql://root:123456@localhost:3306/asto_ec_origin';

var sequelize = new Sequelize(CONNECTION_URL);

var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name'
  },
  lastName: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Product = sequelize.define('Product', {
  title: Sequelize.STRING
});
var Tag = sequelize.define('Tag', {
	name: Sequelize.STRING
});

Product.hasMany(Tag, {foreignKey: 'product_id'});

User.sync();
Product.sync();
Tag.sync();

User.create({
    firstName: 'John',
    lastName: 'Hancock'
});

Product.create({
  id: 1,
  title: 'Chair',
  Tags: [
    { name: 'Alpha'},
    { name: 'Beta'}
  ]
}, {
  include: [ Tag ]
})

_.delay(function(){
	User.findOne().then(function(user) {
		console.log(user.firstName + ' ' + user.lastName);
	});
}, 5000);


