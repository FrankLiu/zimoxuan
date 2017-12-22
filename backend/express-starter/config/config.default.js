module.exports = {
  // mongodb
  mongo_url: 'mongodb://localhost:27017/passport_express_starter',
  
  // express session config
  session: {
    secret: 'express-starter-security', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 60000 }
  },

  // passport config
  passport: {
    strategy: 'github',
    github: {
      clientID: '8bf22eba3888f8452837',
      clientSecret: '',
      callbackURL: 'http://192.168.31.129:3000/login/github/callback'
    }
  }
};