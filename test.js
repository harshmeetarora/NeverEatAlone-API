//test.js
var expect = require("chai").expect;
var assert = require("chai").assert;
var model = require('./Database/db.js');


describe("addClient()", function(){
    it("should add and remove client", function(){
        return returnPromise = model.addNewClient(clientObject1).then(function(content){
            model.deleteClientById(clientObject1.id);
            expect(content.name).to.equal("Laurenz");
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});

describe("addCalendar()", function(){
    it("should add calendar object", function(){
        return returnPromise = model.addCalendar(calendarObject2).then(
        function(content){
            model.deleteCalendar(calendarObject2.id);
            expect(content.id).to.equal("1");
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});

describe("getLocations()", function(){
    it("should getLocation", function(){
        return returnPromise = model.getLocations([1]).then(function(content){
            expect(content[0].coordinates.lat).to.equal(47.2606);
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});

describe("updateLocations()", function(){
    it("should update Location", function(){
        return returnPromise = model.updateLocation("101596347503975", newLocation1).then(function(content){
            expect(content.n).to.equal(1);
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});

describe("getFriends()", function(){
    it("should get Friend array", function(){
        return returnPromise = model.getFriends("101596347503975").then(function(content){
            expect(content[0].friends[0]).to.include({id: "104073207253345"});
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});


// test Objects
var clientObject1 = {
	id : "1",
	name: "Laurenz",
 	email: "notimportant",
 	coordinates: {
 		lat: 47.2606,
 		long: 120.2460,
 	},
 	friends: [{id: "2"}, {id: "3"}]
}
var newLocation1 = {
    lat: 49.2606,
    long: 123.2460
}

var calendarObject2 = { id: "1",
eventDates: [
    {
        id: "1",
        date: "11/17/2018",
        events: [
            {
                key: 1,
                title: "something",
                startNum: 12.5,
                endNum: 17,
            }
        ]
    },{
        date: "11/16/2018",
        events: [
            {
                key: 3,
                title: "something",
                startTime: 18,
                endTime: 19,
            }
        ]
    }
] };
