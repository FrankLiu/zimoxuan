var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var aliasify = require('aliasify');
var vueify = require('vueify');

var aliasifyConfig = {
	aliases: {
		vue: path.join(__dirname,'../node_modules/vue/dist/vue')
	},
	verbose: false
};

browserify('www/js/main.js')
  .transform(aliasify, aliasifyConfig)
  .transform(vueify)
  .bundle()
  .pipe(fs.createWriteStream('www/js/bundle.js'))
  