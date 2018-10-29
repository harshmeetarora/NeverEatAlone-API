
var mongoose = require("mongoose");
mongoose.connect("mongodb://laurenz:huba5a@ds237563.mlab.com:37563/nevereatalone");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("connected succesfully")
});


var clientSchema = new mongoose.Schema({
	name: String,
 	id : Number,
 	age: String,
});

var Client = mongoose.model("Client", clientSchema);


var addNewClient = function(clientInfo){
	Client.create(clientInfo, function(err, client){
		if (err) {
			console.log("saving client failled");
			console.log(client);
		} else {
			console.log("saved following item to db");
			console.log(client);
		}
	}
);
}

var findClient = function(clientInfo){
	Client.find(clientInfo, function(err, data){
	if (err){
		console.log("find failed with error:");
		console.log(err);
	} else {
		console.log("find returned:");
		console.log(data);
	}
});

}

var clearDatabase = function(){
	Client.deleteMany({},
    function(err, results) {
        console.log("\n" + "Database collection 'clients' has been cleared of all items");
    });
}

var deleteClient = function(clientInfo){
	Client.deleteMany(clientInfo,
    function(err, results) {
        console.log("\n" + "Database collection 'clients' has been cleared of ");
        console.log(clientInfo);
    });
}

// deleteClient({"id": 1});

// clearDatabase();

// addNewClient({
// 	name: "Harsh",
//   	id : 3,
//   	age: "something"
//   });

// findClient({"name": "Harsh"});


module.exports = {
  addNewClient : addNewClient,
  findClient : findClient,
  clearDatabase :  clearDatabase 
};



