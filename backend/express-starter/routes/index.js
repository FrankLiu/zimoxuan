var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/register', function(req, res, next){
  res.render('register', {});
});

router.post('/register', function(req, res, next){
  console.log('registering user');
  Account.register(new Account({
    username: req.body.username}), 
    req.body.password,
    function(err, result){
      if(err) {
        console.log('error while user register!', err);
        return res.render('register', {error: err.message});
      }
      console.log('user registered!');
      passport.authenticate('local')(req, res, function(){
        req.session.save(function(err){
          if (err) { return next(err); }
          res.redirect('/profile');
        });zxc
      });
  });
});

router.get('/login', function(req, res, next){
  res.render('login', {user: req.user, error: req.flash('error')});
});

// uncomment for testing
// passport.use('local', new LocalStrategy({
//     usernameField: 'usernmae',
//     passwordField: 'password',
//   },
//   function (username, password, done) {
//     var user = {
//         id: '1',
//         username: 'admin',
//         password: 'pass'
//     }; // 可以配置通过数据库方式读取登陆账号

//     if (username !== user.username) {
//         return done(null, false, { message: 'Incorrect username.' });
//     }
//     if (password !== user.password) {
//         return done(null, false, { message: 'Incorrect password.' });
//     }

//     return done(null, user);
//   }
// ));

router.post('/login', 
  passport.authenticate('local', {
    failureRedirect: '/login', 
    failureFlash: true
  }), 
  function(req, res, next){
    req.session.save(function(err){
      if (err) { return next(err) }
      res.redirect('/profile');
    });
  }
);

router.get('/login/github', passport.authenticate('github'));

router.get('/login/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home. 
    res.redirect('/');
  }
);

router.get('/profile', function(req, res, next){
  res.render('profile', {});
});

router.get('/logout', function(req, res, next){
  req.logout();
  req.session.save(function(err){
    if (err) { return next(err) }
    res.redirect('/');
  });
});

router.get('/ping', function(req, res){
  res.status(200).send('pong');
});

module.exports = router;
