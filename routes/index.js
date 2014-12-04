var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var crypto = require('crypto');

var mongo = require('mongoskin');
require('mongodb');
var db = mongo.db("mongodb://localhost:27017/275p2", {native_parser:true});


var userInfo = db.collection('userlist');
/* GET home page. */
exports.index = function(req, res) {
  res.render('index', { title: 'Hello!' });
};

// build user page
exports.user = function(req, res){
  if (req.session.passport.user === undefined) {
    res.redirect('/login');
  } else {
    var user = userInfo.findOne({username: req.session.passport.user},
    function(err, users) {
        ////////////////////////////////////
      var sentData = [];
      orders.find({user: users._id})
      .populate('itemID')
      .populate('user')
      .exec(function (err, ordr) {
      if (err) return console.error(err);
        var orderDataTotal = 0;
        var photoDataTotal = 0;
        var arrOrder = new Array();
        var arrPhoto = new Array();
        var orderData = new Array();
        //console.log(ordr);
        ordr.forEach(function(item){
          item.itemID.forEach(function(itemID){
            arrOrder.push(itemID);
            orderDataTotal++;
          });
        });
        photoModel.find({user: users._id} , function(err, photos){
          photos.forEach(function(photo){
            photoDataTotal ++;
            arrPhoto.push(photo)
          });
        });
        var sentData = { orderData: arrOrder,
                         photoData: arrPhoto,
                         orderDataTotal: orderDataTotal,
                         photoDataTotal: photoDataTotal};
        //console.log(sentData);
        res.render('user', sentData);
      });
      //res.render('user', { title: 'login', user: 'admin' });
      /////////////////////////////////////////////
    });
  }
};



// build login page
exports.login = function(req, res){
  res.render('login', { title: 'login' });
};

//Build register page
exports.register = function(req, res){
  res.render('register', { msg: '' });
};

//Add registered user
exports.makeRegister = function(req, res){
  var form = new formidable.IncomingForm();
    var user = userInfo.findOne({username: req.body.username},
    function(err, users) {
      if (!users) {
      	//console.log(req.body.username);
        var hashPass = crypto.createHash("sha1").update(req.body.password).digest("hex");
        var toInsertForm = { name: req.body.fullName, email: req.body.email, username: req.body.username, password: hashPass }; 
        userInfo.insert(toInsertForm, function(err, result){
	        res.send(
	            (err === null) ? res.redirect('/') : res.redirect('/register')
	        );
	    });
      }
      else {
        res.render('register', { msg: 'username is already taken' });
      }
    });
  //res.render('register', { title: 'Express' });
};


