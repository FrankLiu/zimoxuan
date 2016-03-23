'use strict'

var http = require('http')
  , request = require('request')

var targetSize = 2*1024*1024 + 1
var requests = Math.ceil(targetSize/8096)

var s = http.createServer(function(req, res) {
  res.statusCode = 200
  res.setHeader('X-PATH', req.url)

  var sent = 0
  ;(function sender() {
    if (sent === targetSize) {
      process.stdout.write("\r")
      res.end()
      return
    }

    var len = Math.min(targetSize - sent, 8096)
    var chunk = new Buffer(len)
    for (var i = 0; i < len; i++) {
      chunk[i] = "A"
    }

    res.write(chunk)
    sent += len

    if (sent%(8096*Math.ceil(requests/100)) === 0) {
      process.stdout.write("\r" + Math.ceil(sent/8096/requests*100) + "%")
    }

    setTimeout(sender, 0)
  })()
})

s.listen(6767)

request.get({
  url: 'http://localhost:6767/hugefile',
  timeout: 18000
}, function(err, resp, body) {
  console.log(resp.headers)
  console.assert(body.length === targetSize)
  console.log("Got %sM of 'A'", Math.floor(body.length/1024/1024))
  console.log("OK")

  s.close()
})

