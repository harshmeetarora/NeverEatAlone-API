//test.js
var expect = require("chai").expect;
var assert = require("chai").assert;
var model = require('./Database/db.js');


describe("addClient()", function(){
    it("should add and remove client", function(){
        return returnPromise = model.addNewClient(clientObject1).then(function(content){
            expect(content.name).to.equal("Laurenz");
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});

describe("addCalendar()", function(){
    it("should add calendar object", function(){
        return returnPromise = model.addCalendar(4, calendarObject2).then(function(content){
            expect(content.id).to.equal(4);
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
        return returnPromise = model.updateLocation(1, newLocation1).then(function(content){
            expect(content.n).to.equal(1);
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});

describe("getFriends()", function(){
    it("should get Friend array", function(){
        return returnPromise = model.getFriends(1).then(function(content){
            expect(content[0].friends[0]).to.include({id: 2});
        }, function(err){
            console.log(err);
            expect(err.name).to.equal("Laurenz");
        });
    });
});


// test Objects
var clientObject1 = {
	id : 1,
	name: "Laurenz",
 	email: "notimportant",
 	coordinates: {
 		lat: 47.2606,
 		long: 120.2460,
 	},
 	friends: [{id: 2}, {id: 3}]
}
var newLocation1 = {
    lat: 49.2606,
    long: 123.2460
}

var clientObject2 = {
	id : 2,
	name: "Harsh",
 	email:  "notimportant",
 	coordinates: {
 		lat: 49.2827,
 		long: 123.1207,
 	},
 	friends: [{id: 1}]
}

var clientObject3 = {
	id : 3,
	name: "Matt",
 	email:  "notimportant",
 	coordinates: {
 		lat: 49.1666,
 		long: 123.1336,
 	},
 	friends: [{id: 1}]
}

var calendarObject2 = [
    {
        date: "11/17/2018",
        events: [
            {
                key: 1,
                title: "something",
                startTime: 12.5,
                endTime: 17,
            },
            {
                key: 2,
                title: "something",
                startTime: 21,
                endTime: 22,
            },
            {
                key: 3,
                title: "something",
                startTime: 18,
                endTime: 19,
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
];

var calendarObject3 =  [
    {
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
];
