var express = require('express');
var router = express.Router();

var mongo = require('mongoskin');
require('mongodb');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('product', { title: 'Express' });
});

/*
 * GET Productlist.
 */
router.get('/Productlist', function(req, res) {
    var db = req.db;
    //console.log(res.locals.user);
    db.collection('Productlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * GET Categories.
 */
router.get('/Category', function(req, res) {
    var db = req.db;
    db.collection('Productlist').distinct('category', function (err, items) {
        res.json(items);
    });
});

/*
 * GET Category.
 */
router.get('/Category/:name', function(req, res) {
    var db = req.db;
    var Category = req.params.name;
    db.collection('Productlist').find({'category' : Category }).toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to addProduct.
 */
router.post('/addProduct', function(req, res) {
    var db = req.db;
    //console.log(db);
    var getProduct = JSON.stringify(req.body);
    var records = getProduct.replace('}' , ', "productuser": "' + res.locals.user +'"}'); //
    console.log(records);
    db.collection('Productlist').insert(JSON.parse(records), function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteProduct.
 */
router.delete('/deleteProduct/:id', function(req, res) {
    var db = req.db;
    var ProductToDelete = req.params.id;
    db.collection('Productlist').removeById(ProductToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * PUT to updateProduct.
 */
router.put('/updateProduct/:id', function(req, res) {
	console.log(req.body);

    var db = req.db;
    //var ProductToUpdate = ;
    db.collection('Productlist').update({_id: mongo.helper.toObjectID(req.params.id)}, {$set: req.body}, function(err, result) {
    	console.log(result);
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
