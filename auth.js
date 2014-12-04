var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

var mongo = require('mongoskin');
require('mongodb');

var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/275p2", {native_parser:true});

passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
  	var hashPass = crypto.createHash("sha1").update(password).digest("hex");
    db.collection('userlist').findOne({'username': username}, function(err, user) {
      if (err) {
        return done(err);
      }
 
      if (!user) {
        return done(null, false);
      }
 
      if (user.password != hashPass) {
        return done(null, false);
      }
 
      return done(null, user);
    });
  });
}));

passport.serializeUser(function(user, done){
	console.log(user);
	done(null, user.username);

});
passport.deserializeUser(function(user, done){
	done(null, user);
});

module.exports = passport;