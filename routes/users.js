var express = require('express');
var router = express.Router();

var mongo = require('mongoskin');
require('mongodb');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('users', { title: 'Express' });
});


router.get('/loggedInUser', function(req, res) {
    var loggedInUser = res.locals.user;
    res.json(loggedInUser);
});
/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to adduser.
 */
router.post('/register', function(req, res) {
    var db = req.db;
    db.collection('userlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * PUT to updateuser.
 */
router.put('/updateuser/:id', function(req, res) {
	console.log(req.body);

    var db = req.db;
    //var userToUpdate = ;
    db.collection('userlist').update({_id: mongo.helper.toObjectID(req.params.id)}, {$set: req.body}, function(err, result) {
    	console.log(result);
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
