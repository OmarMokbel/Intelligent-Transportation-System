const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const uri = "PLACE URI HERE";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (!err) { console.log('MongoDB Connection Successfull.') }
  else { console.log('Error in MongoDB connection : ' + err) }
  const collection = client.db("TollingSystem").collection("tags");
  module.exports.collection = collection;
});

mongoose.connect('PLACE URI HERE', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('Mongoose Connection Successfull.') }
    else { console.log('Error in Mongoose connection : ' + err) }
});
mongoose.set('useCreateIndex', true);

require('./tag.model');