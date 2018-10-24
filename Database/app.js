const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://laurenz:huba5a@ds237563.mlab.com:37563/nevereatalone';

// Database Name
const dbName = 'nevereatalone';
const client = new MongoClient(url);

// Use connect method to connect to the server
// callback is operation function
//item is item to store or search db for
const callDB = (callback, item) => {
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    if (item == undefined)
      callback(db, function(){
        client.close();
      });
    else 
      callback(db, item, function(){
        client.close();
      }); 
  });
};


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






