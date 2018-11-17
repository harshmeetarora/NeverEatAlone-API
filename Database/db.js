
var mongoose = require("mongoose");
mongoose.connect("mongodb://laurenz:huba5a@ds237563.mlab.com:37563/nevereatalone");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("\n"+ "connected succesfully")
});

var calendarSchema = new mongoose.Schema({
	id: Number,
	events: [{
        date: String,
        events: [{
            key: Number,
            title: String,
            startTime: Number,
            endTime: Number,
       	}]
   	}]
});
var Calendar = mongoose.model("Calendar", calendarSchema);

var updateCalendar = function(id, events){ // TODO make sure this is called when new client is created
	return Calendar.update(
		{"id": id},
		{ $set: 
			{"events": events}
		}
	);
}

var checkCalendar = function(friends, date, timeStart, timeEnd){
	return Calendar.find(
		{
			id: {$in: friends},
			events: {
				$elemMatch: {
					date: date,
					events: {
						$elemMatch: {
							startTime: {$gt: timeEnd},
							endTime: {$lt: timeStart}
						}
					}
				}
			}
		},
		{id: 1, _id: 0}
	);
}
/////////////////////////////////////////////////////////////////////////////

var clientSchema = new mongoose.Schema({
	id : String,
	name: String,
 	email: String,
 	coordinates: {
 		lat: Number,
 		long: Number,
 	},
 	friends: [{id: Number}]
});
var Client = mongoose.model("Client", clientSchema);

var addNewClient = function(clientInfo){
	return Client.create(clientInfo);
}

var findClient = function(clientInfo){
	return Client.find(clientInfo);
}

var findClientById = function(id){
	return Client.find({"id": id});
}


var clearDatabase = function(){
	return Client.deleteMany({});
}

var deleteClient = function(clientInfo){
	return Client.deleteOne(clientInfo);
}

var deleteClientById = function(id){
	return Client.deleteOne({"id": id});
}

var getLocation = function(id){
	return Client.find({"id": id}, {"coordinates": 1 , "_id": 0});
}

var updateLocation = function(id, coordinates){
	Client.update({"id": id}, { $set: {"coordinates": coordinates}});
}

var getFriends = function(id){
	return Client.find({"id": id}, {"friends": 1, "_id": 0});
}

module.exports = {
  addNewClient : addNewClient,
  findClient : findClient,
  findClientById : findClientById,
  clearDatabase :  clearDatabase,
  deleteClient : deleteClient,
  deleteClientById : deleteClientById,
  getLocation : getLocation,
  updateLocation : updateLocation, 
  getFriends : getFriends,
  updateCalender : updateCalender,
  checkCalendar : checkCalendar
};