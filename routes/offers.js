var express = require('express');
var router = express.Router();

var mongo = require('mongoskin');
var nativMDB = require('mongodb');


/* GET home page. */
router.get('/makeOffer/:productId', function(req, res) {
  res.render('offers', { title: 'Express' });
});

// GET home page. 
router.get('/', function(req, res) {
  res.render('offers', { title: 'Express' });
});

/*
 * GET offerlist.
 */
router.get('/offersReceived', function(req, res) {
    var db = req.db;
    var user = res.locals.user;
    var offerArray = new Array();

    // serch for all offers
    db.collection('offerlist').find({'status': 'Pending'}).toArray(function (err, OfferItems) {
        // find offered items 
        db.collection('Productlist').find().toArray(function (err, ProductItems) {

            OfferItems.forEach(function(allOffers){
                var result={};
                for(var key in allOffers) result[key]=allOffers[key];
                ProductItems.forEach(function(allProducts){
                    //console.log( allProducts._id.toString() + ' - ' + allOffers.productId.toString());
                    if (allProducts.productuser == user && allProducts._id.toString() == allOffers.productId.toString()) {
                        result.productId = allProducts;
                    } 
                    if (allProducts.productuser != user && allProducts._id.toString() == allOffers.offeredID.toString()) {
                        result.offeredID = allProducts;
                    } 

                });
                offerArray.push(result);
            });
            res.json(offerArray);
        });
    });
});


/*
 * GET offerlist.
 */
router.get('/offersSent', function(req, res) {
    var db = req.db;
    var user = res.locals.user;
    var offerArray = new Array();

    // serch for all offers
    db.collection('offerlist').find().toArray(function (err, OfferItems) {
        // find offered items 
        db.collection('Productlist').find().toArray(function (err, ProductItems) {

            OfferItems.forEach(function(allOffers){
                var result={};
                for(var key in allOffers) result[key]=allOffers[key];
                ProductItems.forEach(function(allProducts){
                    //console.log( allProducts._id.toString() + ' - ' + allOffers.productId.toString());
                    if (allProducts.productuser != user && allProducts._id.toString() == allOffers.productId.toString()) {
                        result.productId = allProducts;
                    } 
                    if (allProducts.productuser == user && allProducts._id.toString() == allOffers.offeredID.toString()) {
                        result.offeredID = allProducts;
                    } 

                });
                offerArray.push(result);
            });
            res.json(offerArray);
        });
    });
});


/*
 * GET offerlist.
 */
router.get('/offerlist', function(req, res) {
    var db = req.db;
    var user = res.locals.user;
    db.collection('Productlist').find({'productuser' : user }).toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to addoffer.
 */
router.post('/addoffer', function(req, res) {
    var db = req.db;
    var insertRecord = {'productId' : mongo.helper.toObjectID(req.body.productId), 'offeredID' : mongo.helper.toObjectID(req.body.offeredID), 'status': req.body.status};

    db.collection('offerlist').insert(insertRecord, function(err, result){
        console.log(result);
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to updateoffer.
 */
router.put('/offerDecision/:id', function(req, res) {
    var db = req.db;
    //var offerToUpdate = ;
    db.collection('offerlist').update({_id: mongo.helper.toObjectID(req.params.id)}, {$set: req.body}, function(err, result) {
    	console.log(result);
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
