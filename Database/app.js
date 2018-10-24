// const express = require('express');
// const bodyparser = require('body-parser');
// const app = express();

// app.get('/home', (req,res) => {
//     res.send("Hello");
// });

// app.listen(3000, () => console.log("SERVER STARTED..."));


//------------------------------------------------------------------
const testClient = {
	name: "Laurenz",
	id : 1,
	age: "sda",
}
const nameSearch = "Laurenz";
const idSearch = 1;


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://laurenz:huba5a@ds237563.mlab.com:37563/nevereatalone';

// Database Name
const dbName = 'nevereatalone';
const client = new MongoClient(url);

// Use connect method to connect to the server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  // addNewClient(db, testClient,function() {
  //   findClientByName(db, nameSearch, function() {
  //   	findClientByID(db, idSearch,function() {
  //   		client.close();
  //   	});
  //   });
  // });

  clearDatabase(db, function(){
  	client.close();
  });
});

//------------------------------------------------------------------

const addNewClient = function(db, clientInfo, callback) {
  // Get the documents collection
  const collection = db.collection('clients');
  // Insert some documents
  collection.insertOne(clientInfo, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log("\n" + "New Client added to clients collection");
    callback(result);
  });
}

// //------------------------------------------------------------------

const findClientByName = function(db, clientName, callback) {
  // Get the documents collection
  const collection = db.collection('clients');
  // Find some documents
  collection.find({"name": clientName}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("\n" + "Found the following records searching for name: " + clientName);
    console.log(docs);
    callback(docs);
  });

}

const findClientByID = function(db, id, callback) {
  // Get the documents collection
  const collection = db.collection('clients');
  // Find some documents
  collection.find({"id": id}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("\n" + "Found the following records searching for id: " + id);
    console.log(docs);
    callback(docs);
  });

}

const clearDatabase = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('clients');
  // Find some documents
  collection.deleteMany({},
  	function(err, results) {
        console.log("\n" + "Database collection 'clients' has been cleared of all items");
        callback();
    }
  );

}





