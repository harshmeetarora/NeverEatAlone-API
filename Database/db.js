
var mongoose = require("mongoose");
mongoose.connect("mongodb://laurenz:huba5a@ds237563.mlab.com:37563/nevereatalone");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("\n"+ "connected succesfully")
});

var clientSchema = new mongoose.Schema({
	id : String,
	name: String,
 	email: String,
 	coordinates: {
 		lat: Number,
 		long: Number,
 	}
});

var Client = mongoose.model("Client", clientSchema);


var addNewClient = function(clientInfo){
	console.log("laurenz's shitty code")
	console.log(clientInfo);
	Client.create(clientInfo, function(err, data){
		if (err) {
			console.log("saving client failled");
			console.log(data);
		} else {
			console.log("\n"+ "saved following item to db");
			console.log(data);
		}
	}
);
}

var findClient = function(clientInfo){
	var returnData;
	Client.find(clientInfo, function(err, data){
		if (err){
			console.log("find failed with error:");
			console.log(err);
			return;
		} else {
			console.log("\n"+ "find returned:");
			console.log(data);
			returnData = data;
		}
	});
	return returnData;
}

var findClientById = function(id){
	var returnData;
	Client.find({"id": id}, function(err, data){
		if (err){
			console.log("find failed with error:");
			console.log(err);
			return;
		} else {
			console.log("\n"+ "findClientById with id:" + id + " returned:");
			console.log(data);
			returnData = data;
		}
	});
	return returnData;
}


var clearDatabase = function(){
	Client.deleteMany({},
    function(err, data) {
    	if (err){
			console.log("getLocation failed with error:");
			console.log(err);
		} else {
        	console.log("Database collection 'clients' has been cleared of all items");
        }
    });
}

var deleteClient = function(clientInfo){
	Client.deleteOne(clientInfo,
    function(err, data) {
    	if (err){
			console.log("deleteClient failed with error:");
			console.log(err);
		} else {
        	console.log("\n" + "Database collection 'clients' has been cleared of ");
        	console.log(clientInfo);
        }
    });
}

var deleteClientById = function(id){
	Client.deleteOne({"id": id}, function(err, data) {
		if (err){
			console.log("deleteClientById failed with error:");
			console.log(err);
		} else {
        console.log("\n" + "Database collection 'clients' has been cleared of ");
        console.log(data);
    }
    });
}

var getLocation = function(id){
	var returnData;
	Client.find({"id": id}, {"coordinates": 1 , "_id": 0}, function(err, data){
		if (err){
			console.log("getLocation failed with error:");
			console.log(err);
		} else {
			console.log("\n"+ "Location of " + id + " is:");
			console.log(data);
			returnData = data;
		}
	});
	return returnData;
}

var updateLocation = function(id, coordinates){
	Client.update({"id": id}, { $set: {"coordinates": coordinates}}, 
		function(err, data){
			if (err){
				console.log("updateLocation failed with error:");
				console.log(err);
			} else {
				console.log("\n"+ "Location of " + id + " updated to:");
				console.log(data);
		}
	});
}


// addNewClient(clientInfo);
// findClient(clientInfo);
// findClientById(id);
clearDatabase();
// deleteClient(clientInfo);
// deleteClientById(id);

// getLocation(id);
// updateLocation(id, coordinates);
// async function asycCall(){
// 	var a = await getLocation("2");
// 	deleteClientById("2");
// }

// asycCall();

module.exports = {
  addNewClient : addNewClient,
  findClient : findClient,
  findClientById : findClientById,
  clearDatabase :  clearDatabase,
  deleteClient : deleteClient,
  deleteClientById : deleteClientById,
  getLocation : getLocation,
  updateLocation : updateLocation 
};

// addNewClient({
// 	id : "3",
// 	name: "Matt",
//  	email: "someEmail2",
//  	coordinates: {
//  		lat: 3124,
//  		long: 9813,
//  	}
// });



// findClientById("3");

// findClientById("2");
// deleteClientById("3");
// getLocation("2");

// updateLocation("2", {lat: 3123, long: 31921});
// getLocation("2");



