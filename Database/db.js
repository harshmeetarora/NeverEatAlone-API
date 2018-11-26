
var mongoose = require("mongoose");
mongoose.connect("mongodb://laurenz:huba5a@ds237563.mlab.com:37563/nevereatalone");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("\n"+ "connected succesfully")
});

var calendarSchema = new mongoose.Schema({
	id: String,
	eventDates: [{
        date: String,
        events: [{
            key: Number,
            title: String,
            startNum: Number,
			endNum: Number,
			startTime: String,
			endTime: String,
       	}]
   	}]
});
var Calendar = mongoose.model("Calendar", calendarSchema);


var addCalendar = function(calendar){
	console.log("addCalendar called");
	return Calendar.create(calendar);
}

var updateCalendar = function(id, events){ 
	return Calendar.update(
		{"id": id},
		{ $set: 
			{"eventDates": events}
		}
	);
}

var deleteCalendar = function(id){
	return Calendar.deleteOne({"id": id});
}
// {"_id": 0, "eventDates": 1}
var getCalendar = function(id){
	return Calendar.find({id: id}, {eventDates: 1, _id: 0});
}

var checkCalendar = function(friends, date, timeStart, timeEnd){
	return Calendar.find(
		{
			id: {$in: friends},
			eventDates: {
				$elemMatch: {
					date: date,
					events: {
						$elemMatch: {
							startNum: {$lt: timeEnd},
							endNum: {$gt: timeStart}
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
	 friends: [{id: Number}],
	 pushToken: String
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

var getLocations = function(friends){
	return Client.find({id: {$in: friends}}, {"id": 1, "coordinates": 1, "_id": 0});
}

var updateLocation = function(id, coordinates){ 
	return Client.update({"id": id}, { $set: {"coordinates": coordinates}});
}

var getFriends = function(id){
	return Client.find({"id": id}, {"friends": 1, "_id": 0});
}

var getPushToken = function(id){
	return Client.find({"id": id}, {"pushToken": 1, "_id": 0});
}

module.exports = {
  addNewClient : addNewClient, //used --> works
  findClient : findClient, //not needed
  findClientById : findClientById, //will be used later
  clearDatabase :  clearDatabase,
  deleteClient : deleteClient, 
  deleteClientById : deleteClientById,
  getLocations : getLocations, //used --> works
  updateLocation : updateLocation,  //used --> works
  getFriends : getFriends, // used --> works
  addCalendar : addCalendar, // used --> works
  updateCalendar : updateCalendar, // used --> works
  deleteCalendar : deleteCalendar,
  getCalendar : getCalendar,
  checkCalendar : checkCalendar, //used --> works
  getPushToken : getPushToken
};