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
      clientSecret: '084ef3fed22babc3e15ddf7496fde7a06f53ac3c',
      callbackURL: 'http://127.0.0.1:3000/login/github/callback'
    }
  }
};