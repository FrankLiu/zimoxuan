module.exports = function(app){
  app.dataSources.restdb.automigrate('CoffeeShop', function(err){
    if(err) throw err;

    app.models.CoffeeShop.create([{
      name: '临江小店',
      province: '浙江省',
      city: '杭州市'
    }, {
      name: '鲜丰水果',
      province: '浙江省',
      city: '杭州市滨江区'
    }], function(err, coffeeShops){
      if(err) throw err;

      console.log('Models created: \n', coffeeShops);
    });
  });
}
