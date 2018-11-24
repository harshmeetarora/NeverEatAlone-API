let express = require('express');
let model = require('./Database/db.js');
let yelpAPI = require ('./yelp-api.js');
let Hashids = require('hashids');
let geolib = require('geolib');

var hashids = new Hashids();

let router  = express.Router();


//test 
router.route('/test')
    .get((req,res) => {
        console.log("check");
        res.send("Hello");
});

//calendarPut --> WORKS
router.route('/updateCalendar')
    .post((req,res) => {
        console.log("update calendar route called");
        var id = req.body.id;
        var calendar = req.body;
        deleteCalendarPromise = model.deleteCalendar(id);
        deleteCalendarPromise.then(
            function(){
                newCalendarPromise = model.addCalendar(calendar);
                newCalendarPromise.then(
                    function(content){
                        res.send("sucess" + content);
                    },
                    function(err2){
                        res.send("failure2: " + err2);
                    }
                );
            },
            function(err1){
                res.send("failure1: " + err1);
            }
        );    
});


// friend availability get --> works
router.route('/getFriendsStatus')
    .get((req,res) => {
        var id = req.query.id;

        var d = new Date();
        var date = d.toLocaleDateString();
        var hours = (d.getUTCHours() + 16)/24; //UTC - adjustment for westcoast canada
        var minutes = d.getMinutes() / 60; // 60 minutes in an hour 
        var time = hours + minutes; // time as a float 0-24
        console.log("get friends status called");
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
                        var returnJSON = formatFriendsAvailability(friends, unavailableFriends);
                        console.log("returnJSON: "+ returnJSON);
                        res.send(returnJSON);
                    },
                    function (err2){
                        res.send("err2 getFriendsStatus :" + err2);
                    }
                );
            },
            function (err){
                res.send("err1 getFriendsStatus" + err);
            }
        );
});

var formatFriendsAvailability = function(friends, unavailableFriends){
    var returnObject = [];
    var bool;
    for (var i = 0; i < friends.length(); i++){ 
        if (unavailableFriends.includes(friends[i])){
            bool = false;
        } else {
            bool = true;
        }
        returnObject[i] = {id: friends[i], status: bool};
    }
    return returnObject;
}



//getDistance --> (id) --> [{id:id, distance:distance}]
// tested --> works
router.route('/getDistance')
    .get((req,res) => {
        var id = req.query.id;
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
    .post((req,res) => {
        // TODO deal with user already exists case
        let user = req.body.user;
        let id = user.id;
        console.log("add/update client route called");
        var deletePromise = model.deleteClientById(id);
        deletePromise.then(
            function(){
                var newClientPromise = model.addNewClient(user);
                newClientPromise.then(
                    function(content){
                        res.send("sucess1: " + content);
                    },
                    function(err1){
                        res.send("error1 occured: " + err1);
                    }        
                );
            },
            function(err2){
                res.send("error2 occured: " + err2);
            }
        );  
});

// tested --> works
router.route('/updateLocation')
    .put((req,res) => {
    // .get((req,res) => {
        let id = req.body.id;
        let location = req.body.location;
        
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
    // var latitude = '49.246292' ;
    // var longitude = '-123.116226' ;
    // var radius ='1000';
    // var term = "bar";

    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var radius =req.query.radius;
    var term = req.query.term;

    console.log(latitude);
    console.log(longitude);
    console.log(radius);

    //console.log(JSON.stringify(req.params));

    var yelpPromise = yelpAPI.getYelpRecommendation(latitude, longitude, radius, term);
    //console.log(yelpPromise);
    yelpPromise.then(
        function(content){
            res.send({'Recommendations' : content});
        });
});


module.exports = router;