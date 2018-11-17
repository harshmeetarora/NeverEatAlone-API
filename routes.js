let express = require('express');
let model = require('./Database/db.js');
let Hashids = require('hashids');
let geolib = require('geolib');

var hashids = new Hashids();

let router  = express.Router();

// 


//test 
router.route('/test')
    .get((req,res) => {
        console.log("check");
        res.send("Hello");
});

//calendarPut
router.route('/addCalendar')
    .post((req,res) => {
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
router.route('/getAvailableFriends')
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

        res.send("Hello");
});

router.route('/getDistance')
    .get((req,res) => {
        var id1 = req.body.id1;
        var id2 = req.body.id2;

        var location1Promise = model.getLocation(id);

        location1Promise.then(
            function (content){
                location1 = content;
                location2Promise = model.getLocation(id);

                location2Promise.then(
                    function (content2){
                        var location2 = content2;
                        var distance = geolib.getDistance(location1,location2);
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

router.route('/addUser')
    .post((req,res) => {
        //console.log(req.body);
        let user = req.body;
        //console.log(user);
        model.addNewClient(user);
        //let friend = model.findClientById(user.id);
        //console.log(friend);
        res.send("user added");

        
});

//PUT update user location
router.route('/updateLocation')
    .put((req,res) => {
        let id = req.body.id;
        let location = req.body.location;
        console.log(location);
        model.updateLocation(id, location);
        res.send({'location' : location});
});

// router.route('/updateLocation')
//     .put((req,res) => {
//         let id = req.body.id;
//         let location = req.body.location;
//         console.log(location);
        
//         var promise = model.updateLocation(id, location);
//         promise.then(function() {
//             res.send("user added");
//         }, function(err) {
//             res.send(err)
//         });
//         res.send({'location' : location});
// });


//GET friends in certain radius id
router.route('/getNearFriends')
    .get((req,res) => {
        let id = req.body.id;
        let radius = req.body.radius;
        var nearFriendsIds = getNearFriends(id, radius);
        res.send(nearFriendsIds);
});

//get free friends near me
function getNearFriends(id, radius){
    let friends = model.findClientById(id).friends;
        let userLocation = model.getLocation(id);
        // let userLocation = {latitude: 51.5103, longitude: 7.49347};
        // let friendLocation = {latitude: 23.5103, longitude: 42.49347};
        //let radius = 4311099;
        var nearFriendsIds = [];
       // var friends = ['1','2','3','4','5','6','7','8','9'];
        for (i in friends){
            let friendLocation = model.getLocationById(id);
            let distance = geolib.getDistance(userLocation,friendLocation);
            if (distance <= radius){
                nearFriendsIds.push(i);
            }
        }
        return nearFriendsIds;
}


module.exports = router;