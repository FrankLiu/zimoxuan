'use strict';

var url = require('url');
var http = require('http');
var fs = require('fs');

/**
 * It is for demostrate a nodejs simple http server
 *  Add more comments, just for performance testing
 [root@host-10-200-131-8 ~]# wrk -c50 -t10 http://10.200.5.86:3000/file
 Running 10s test @ http://10.200.5.86:3000/file
   10 threads and 50 connections
   Thread Stats   Avg      Stdev     Max   +/- Stdev
     Latency    48.41ms  155.77ms 961.39ms   93.24%
     Req/Sec   691.97    127.61     0.88k    93.19%
   62791 requests in 10.01s, 69.16MB read
 Requests/sec:   6273.90
 Transfer/sec:      6.91MB

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
