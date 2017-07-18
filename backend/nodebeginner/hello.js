'use strict';

var url = require('url');
var http = require('http');
var fs = require('fs');

/**
 * It is for demostrate a nodejs simple http server
 *  Add more comments, just for performance testing
 *  Need more
 *  Add moredddadadadadadadadadadadadadadadadadadadadaadfdadfdfakljad;kdfa
 *  dfdfakdfadfkasdfja;dfkajdfas;dfja;dfasjd;fadfa
 *  dfakfadad;fad;fakldfaskdfajdfa;dfasdfka;adfas;dadfjaskldfjadfad;fa;l
 *  dfdfakdfadfkasdfja;dfkajdfas;dfja;dfasjd;fadfa
 *  dfakfadad;fad;fakldfaskdfajdfa;dfasdfka;adfas;dadfjaskldfjadfad;fa;l
 */
http.createServer(function(req, res){
  var pathname = url.parse(req.url).pathname;
  console.log("[%s] Request path: %s", new Date(), pathname);

  switch(pathname){
    case '/hello':
      res.end('hello nodejs!');
      break;
    case '/file':
      fs.readFile('hello.js', 'utf8', function(err, f){
        res.end(f);
      });
      break;
    default:
      res.end('hello world!');
      break;
  }
}).listen(3000);
console.log('server started and listening on port: 3000');
