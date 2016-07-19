'use strict';

const express = require('express');
const request = require('request');
const User = require('../models/user');
const YelpModel = require('../models/yelp')

var Yelp = require('yelp');

// var yelp = new Yelp({
//   consumer_key:"HN7OnaDPRS5d8tr7-H47bQ",
//   consumer_secret:"kF3pIO8XzzEVp9bIRZoRyTofEnQ",
//   token:"5DDceCRdmDQY22hMMlwgkx00Og5MxW8T",
//   token_secret:"0Fb-rx1m-b5gFYxpkJJSLpzf8c0"
// });
var yelp = new Yelp({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret
});

console.log({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  token: process.env.token,
  token_secret: process.env.token_secret
})


//////////////////////////////////////////////////////////////////////////////////////
let router = express.Router();
// var beer = 'Uu2ExM'

router.get('/search/:term/:location', (req,res) => {
  console.log('req.params.term', req.params.term)
  yelp.search({
    term: req.params.term,
    location: req.params.location,
  }).then(function (data) {

    res.send(data)
    // ...
  })
  .catch(err => {
    console.log('err:', err)
    res.status(400).send(err);
  })

})

router.get('/business/:id', (req,res) => {
  console.log(req.params.id);
  yelp.business(req.params.id)
  .then(data => {
    console.log("DATATATATATA", data);
    res.send(data)
  })


})


router.route('/')
  .get((req,res) => {
    console.log('yelp', yelp);
    YelpModel.find({}, (err, tests) => {
      res.status(err ? 400 : 200).send(err || tests)
    })
  })
  .post((req,res) => {
    YelpModel.create(req.body, (err,test) => {
      res.status(err ? 400 : 200).send(err || test)
    })
  })
router.route('/:id')
  .get((req, res) => {
    YelpModel.findById(req.params.id, (err, test) => {
      res.status(err ? 400 : 200).send(err || test)
    })
  })
  .put((req,res) => {
    YelpModel.findOneAndUpdate(req.params.id, req.body, (err) => {
      res.status(err ? 400 : 200).send(err)
    })
  })
  .delete((req,res) => {
    YelpModel.findOneAndRemove(req.params.id, err => {
      res.status(err ? 400 : 200).send(err)
    })
  })

router.get('/users/:id', User.authorize({admin: false}),(req,res) => {
console.log('hit again');
  YelpModel.find({user: req.user._id}, (err, stocks) => {
    res.status(err ? 400: 200).send(err || stocks)
  })
  // console.log("Request.User", req.user);
})
// router.



module.exports = router;
