let express = require('express');
let model = require('./Database/db.js');
let yelpAPI = require ('./yelp-api.js');
let Hashids = require('hashids');
let geolib = require('geolib');

var hashids = new Hashids();

let router  = express.Router();

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


//test 
router.route('/test')
    .get((req,res) => {
        console.log("check");
        res.send("Hello");
});

//calendarPut --> WORKS
router.route('/updateCalendar')
    // .post((req,res) => {
    .get((req,res) => {
        console.log("update calendar route called");
        // var id = req.body.id;
        // var events = req.body.calendar;
        var id = 3;
        var events = calendarObject2;
        var calendarPromise = model.updateCalendar(id, events); 
        calendarPromise.then(
            function(content){
                res.send("sucess: " + content);
            },
            function(err){
                res.send("failure: " + err);
            }
        );
});

// friend availability get --> works
router.route('/getNotAvailableFriends')
    .get((req,res) => {
        // var id = req.body.id;
        var id = 1;
        var d = new Date();
        var date = d.toLocaleDateString();
        var hours = d.getUTCHours() - 8; //UTC - adjustment for westcoast canada
        var minutes = d.getMinutes() / 60; // 60 minutes in an hour 
        var time = hours + minutes; // time as a float 0-24
        console.log(hours);

        var friendsPromise = model.getFriends(id);

        friendsPromise.then(
            function(content){
                var friends = [];
                content[0].friends.forEach(function(item, index){
                    friends[index] = item.id;
                });
                console.log(friends);
                var calendarPromise = model.checkCalendar(friends, date, time, (time+0.5)); //TODO get rid of magic number
                calendarPromise.then(
                    function(content2){
                        console.log("unavailable friends: ");
                        console.log(content2);
                        var unavailableFriends = [];
                        content2.forEach(function(item, index){
                            unavailableFriends[index] = item.id;
                        });
                        var returnJSON = {friends:friends, unavailableFriends:unavailableFriends};
                        res.send(returnJSON);
                    },
                    function (err2){
                        res.send(err2);
                    }
                );
            },
            function (err){
                res.send(err);
            }
        );
});


//getDistance --> (id) --> [{id:id, distance:distance}]
// tested --> works
router.route('/getDistance')
    .get((req,res) => {
        // var id = req.body.id1;
        var id = 1;
        var friendsPromise = model.getFriends(id);

        friendsPromise.then(
            function (content){
                var friends = [];
                content[0].friends.forEach(function(item, index){
                    friends[index] = item.id;
                });
                friends.push(id);
                var locationPromise = model.getLocations(friends);
                locationPromise.then(
                    function (content2){
                        console.log("got locations");
                        for(var i = 0; i < content2.length; i++){
                            if (content2[i].id == id)
                                break;
                        }
                        userLocation = content2[i].coordinates;

                        var distances = [];
                        for(var i = 0; i < content2.length; i++){
                            var distance = geolib.getDistance(
                                    {longitude: userLocation.long, latitude: userLocation.lat},
                                    {longitude: content2[i].coordinates.long, latitude: content2[i].coordinates.lat}
                                );
                            distances[i] = {id: content2[i].id, distance: distance};
                            console.log(distances[i]);
                        }
                        console.log("actual distances : " + distances);
                        res.send(distances);
                    },
                    function (err2){
                        res.send(err2);
                    }
                );
            },
            function (err){
                res.send(err);
            }
        );
});

//hash id
router.route('/idHash')
    .post((req,res) => {
        var fbID = req.body.id;
        var hashId = hashids.encode(fbID);
        console.log("hashId: " + hashId);
        res.send(JSON.stringify({
            'id' : hashId
    }));
});


// tested --> works
router.route('/addUser')
    // .post((req,res) => {
    .get((req,res) => {
        // TODO deal with user already exists case
        // let user = req.body;
        console.log("add new client route called");
        let user = clientObject1;
        let calendar = calendarObject2;
        let id = user.id;

        var clientPromise = model.addNewClient(user);
        clientPromise.then(
            function(content){
                var calendarPromise = model.addCalendar(id, calendar);
                calendarPromise.then(
                    function(content2){
                        // res.send("success user + calendar added: " + content + content2);
                        res.send("success");
                    },
                    function(err2){
                        res.send("error occured: " + err2);
                    }        
                );
            },
            function(err){
                res.send("error occured: " + err);
            }
        );
});


// tested --> works
router.route('/updateLocation')
    // .put((req,res) => {
    .get((req,res) => {
        // let id = req.body.id;
        // let location = req.body.location;
        let id = 1;
        let location = newLocation1;
        
        var promise = model.updateLocation(id, location);
        promise.then(function(content) {
            res.send("location updated: " + content);
        }, function(err) {
            res.send("updating location yielded error: " + err)
        });
});

///yelp api call
// tested --> works
router.route('/yelp')
    .get((req,res) => {
    var latitude = '49.246292' ;
    var longitude = '-123.116226' ;
    var radius ='1000';
    var term = "bar";

    var yelpPromise = yelpAPI.getYelpRecommendation(latitude, longitude, radius, term);
    //console.log(yelpPromise);
    yelpPromise.then(
        function(content){
            console.log(content);
            res.send({'Recommendations' : content});
        });
});


module.exports = router;