'use strict';

const mongoose = require('mongoose');

let yelpSchema = new mongoose.Schema({
  user: String,
  id: String,
  count: {
    type: Number,
    default:1
  }

  //user:{type:Type.ObjectId'}
});

yelpSchema.methods.addCount = function (cb){
  this.count++;
  this.save(cb)
}

let Yelp = mongoose.model('Yelp', yelpSchema)

module.exports = Yelp;
