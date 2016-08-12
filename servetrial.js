// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://thread:thread123@ds023105.mlab.com:23105/heroku_czld3m55", function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});