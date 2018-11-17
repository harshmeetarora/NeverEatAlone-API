let express = require('express');
let model = require('./Database/db.js');
let yelpAPI = require ('./yelp-api.js');
let Hashids = require('hashids');
let geolib = require('geolib');
let yelp = require('yelp-fusion');

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
        date: "11/16/2018",
        events: [
            {
                key: 1,
                title: "something",
                startTime: 19.5,
                endTime: 20.5,
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

//calendarPut
// TODO test this
router.route('/updateCalendar')
    .post((req,res) => {
        console.log("add new client route called");
        var id = req.body.id; // TODO adjust with matt
        var events = req.body.calendar;
        var calendarPromise = model.updateCalendar(id, events); 
        calendarPromise.then(
            function(){
                res.send(1);
            },
            function(){
                res.send(0);
            }
        );
});

// friend availability get
//TODO test this
router.route('/getNotAvailableFriends')
    .get((req,res) => {
        var id = req.body.id;
        var d = new Date();
        var date = d.toLocaleDateString();
        var time = d.getHours();
        var time = time + (d.getMinutes/60); //TODO get rid of magic number

        var friendsPromise = model.getFriends(id);

        friendsPromise.then(
            function(contents){
                var friends = contents;
                var calendarPromise = model.checkCalendar(friends, date, time, (time+0.5)); //TODO get rid of magic number
                calendarPromise.then(
                    function(contents2){
                        var returnJSON = {friends:friends, unavailableFriends:contents2};
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
//TODO test this
router.route('/getDistance')
    .get((req,res) => {
        // var id1 = req.body.id1;
        // var id2 = req.body.id2;
        var id1 = 1;
        var id2 = 2;
        var location1Promise = model.getLocation(id1);

        location1Promise.then(
            function (content){
                console.log("got location 1");
                var location1 = content;
                var location2Promise = model.getLocation(id2);

                location2Promise.then(
                    function (content2){
                        console.log("got location 2");
                        var location2 = content2;
                        var distance = geolib.getDistance(location1,location2);
                        //TODO the location jsons need to be turned from {long: lat} to {longitude, latitude}
                        console.log("actual distance : " + distance);
                        res.send(distance);
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

// //add user
// router.route('/addUser')
//     .post((req,res) => {
//         let user = req.user;
//         console.log("db");
//         var promise = model.addNewClient(user);
//         promise.then(function() {
//             res.send("user added");
//         }, function(err) {
//             res.send(err);
//             console.log("ERROR adding user")
//         });
// });

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
                        res.send("success user + calendar added: " + content + content2);
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

//PUT update user location
// router.route('/updateLocation')
//     .put((req,res) => {
//         let id = req.body.id;
//         let location = req.body.location;
//         console.log(location);
//         model.updateLocation(id, location);
//         res.send({'location' : location});
// });

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


//GET friends in certain radius id
// router.route('/getNearFriends')
//     .get((req,res) => {
//         let id = req.body.id;
//         let radius = req.body.radius;
//         var nearFriendsIds = getNearFriends(id, radius);
//         res.send(nearFriendsIds);
// });

// //get free friends near me
// function getNearFriends(id, radius){
//     let friends = model.findClientById(id).friends;
//         let userLocation = model.getLocation(id);
//         // let userLocation = {latitude: 51.5103, longitude: 7.49347};
//         // let friendLocation = {latitude: 23.5103, longitude: 42.49347};
//         //let radius = 4311099;
//         var nearFriendsIds = [];
//        // var friends = ['1','2','3','4','5','6','7','8','9'];
//         for (i in friends){
//             let friendLocation = model.getLocation(id);
//             let distance = geolib.getDistance(userLocation,friendLocation);
//             if (distance <= radius){
//                 nearFriendsIds.push(i);
//             }
//         }
//         return nearFriendsIds;
// }

///yelp api call
// tested --> works
router.route('/yelp')
    .get((req,res) => {
    var latitude = '49.246292' ;
    var longitude = '-123.116226' ;
    var radius ='1000';
    var term = "bar";
        var getYelpRecommendation = yelpAPI.getYelpRecommendation(latitude, longitude, radius, term);

        res.send({'Recommedations' : getYelpRecommendation});
});


module.exports = router;