'use strict';

var async = require('async');

module.exports = function(app){
  var mysqlDs = app.dataSources.mysqlDs;
  var mongoDs = app.dataSources.mongoDs;
  async.parallel({
    reviewers: async.apply(createReviewers),
    coffeeShops: async.apply(createCoffeeShops)
  }, function(err, results){
    if (err) throw err;
    createReviews(results.reviewers, results.coffeeShops, function(err) {
      console.log('> models created sucessfully');
    });
  });

  //create reviewers
  function createReviewers(cb){
    mongoDs.automigrate('Reviewer', function(err){
      if(err) return cb(err);
      var Reviewer = app.models.Reviewer;
      Reviewer.create([
        {
          email: 'liujun@xjastc.com',
          password: '123456'
        },
        {
          email: 'john@doe.com',
          password: 'johndoe',
        },
        {
          email: 'jane@doe.com',
          password: 'janedoe',
        }
      ], cb);
    })
  }

  //create coffeeShops
  function createCoffeeShops(cb){
    mysqlDs.automigrate('CoffeeShop', function(err){
      if(err) return cb(err);
      var CoffeeShop = app.models.CoffeeShop;
      CoffeeShop.create([
      {
        name: '临江小店',
        province: '浙江省',
        city: '杭州市'
      },
      {
        name: '鲜丰水果',
        province: '浙江省',
        city: '杭州市滨江区'
      },
      {
        name: '和田小店',
        province: '浙江省',
        city: '杭州市'
      }
      ], cb);
    })
  }

  //create reviews
  function createReviews(reviewers, coffeeShops, cb){
    mongoDs.automigrate('Review', function(err){
      if(err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'A very good coffee shop.',
          publisherId: reviewers[0].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Quite pleasant.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'It was ok.',
          publisherId: reviewers[1].id,
          coffeeShopId: coffeeShops[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'I go here everyday.',
          publisherId: reviewers[2].id,
          coffeeShopId: coffeeShops[2].id,
        }
      ], cb);
    })
  }

}
