'use strict';

module.exports = function(server) {
  var router = server.loopback.Router();

  // Install a `/status` route that returns server status
  router.get('/status', server.loopback.status());

  // Install a "/ping" route that returns "pong"
  router.get('/ping', function(req, res) {
    res.send('pong');
  });

  server.use(router);
};
