let express = require('express');
let model = require('./Database/db.js');
let yelpAPI = require ('./yelp-api.js');
let Hashids = require('hashids');
let geolib = require('geolib');
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

let router  = express.Router();

router.route('/updateCalendar')
    .post((req,res) => {
        var id = req.body.id;
        var calendar = req.body;
        var deleteCalendarPromise = model.deleteCalendar(id);
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
    }
);

router.route('/getCalendar')
     .get((req,res) => {
        var id = req.query.id;
        var calendarPromise = model.getCalendar(id);
        calendarPromise.then(
            function(content){
                res.send(content);
            },
            function(err){
                res.send("error get calendar: " + err);
            }
        );
     }
 );

 var formatFriendsAvailability = function(friends, unavailableFriends){
    var returnObject = [];
    var bool;

    for (var i = 0; i < friends.length; i++){ 
        if (unavailableFriends.includes(friends[i])){
            bool = false;
        } else {
            bool = true;
        }
        returnObject[i] = {id: friends[i], status: bool};
    }
    return returnObject;
}

router.route('/getFriendsStatus')
    .get((req,res) => {
        var id = req.query.id;
        var d = new Date();
        var date = d.toLocaleDateString('en-US', {
            timeZone: 'America/Vancouver'
          });
        var hours = (d.getUTCHours() + 16)%24; //UTC - adjustment for westcoast canada
        var minutes = d.getMinutes() / 60; // 60 minutes in an hour 
        var time = hours + minutes; // time as a float 0-24

        var friendsPromise = model.getFriends(id);
        friendsPromise.then(
            function(content){
                var friends = [];
                content[0].friends.forEach(function(item, index){
                    friends[index] = item.id;
                });
                var calendarPromise = model.checkCalendar(friends, date, time, (time+0.5)); //TODO get rid of magic number
                calendarPromise.then(
                    function(content2){
                        var unavailableFriends = [];
                        content2.forEach(function(item, index){
                            unavailableFriends[index] = item.id;
                        });
                        var returnJSON = formatFriendsAvailability(friends, unavailableFriends);
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
    }
);

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
                        for(var i = 0; i < content2.length; i++){
                            if (content2[i].id == id)
                                break;
                        }
                        userLocation = content2[i].coordinates;

                        var distances = [];
                        for(i = 0; i < content2.length; i++){
                            var distance = geolib.getDistance(
                                    {longitude: userLocation.long, latitude: userLocation.lat},
                                    {longitude: content2[i].coordinates.long, latitude: content2[i].coordinates.lat}
                                );
                            distances[i] = {id: content2[i].id, distance: distance};
                            
                        }
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
    }
);

router.route('/addUser')
    .post((req,res) => {
        let user = req.body.user;
        let id = user.id;
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
    }
);

router.route('/deleteUser')
    .delete((req,res) => {
        let id = req.user.id;
        var deletePromise = model.deleteClientById(id);
        deletePromise.then(
            function(content){
                res.send("sucess1: " + content);
            },
            function(err){
                res.send("error2 occured: " + err);
            }
        );  
    }
);

router.route('/updateLocation')
    .put((req,res) => {
        let id = req.body.id;
        let location = req.body.location;
        var promise = model.updateLocation(id, location);
        promise.then(function(content) {
            res.send("location updated: " + content);
        }, function(err) {
            res.send("updating location yielded error: " + err)
        });
    }
);


router.route('/yelp')
    .get((req,res) => {
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var radius =req.query.radius;
    var term = req.query.term;
    var yelpPromise = yelpAPI.getYelpRecommendation(latitude, longitude, radius, term);
    yelpPromise.then(
        function(content){
            res.send({'Recommendations' : content});
        },
        function(err){
            res.send("error at yelp: " + err);
        });
    }
);

router.route('/sendInvite')
    .post((req,res) => {
        var friendId = req.body.id2;
        var messageBody = req.body.data;

        var pushToken;
        var pushTokenPromise = model.getPushToken(friendId);
        pushTokenPromise.then(
            function(content){
                pushToken = content[0].pushToken;
                res.send({'Token' : pushToken});
                if (!Expo.isExpoPushToken(pushToken)) {
                    console.error(`Push token ${pushToken} is not a valid Expo push token`);
                }
                var friendName= req.body.data.friendName;
                let message = {
                    to: pushToken,
                    sound: 'default',
                    body: `${friendName} does not want to eat alone!`,
                    data: { withSome: messageBody}
                };
                (async () => {
                    try {
                        let ticket = await expo.sendPushNotificationsAsync(message);
                    } catch (error) {
                        console.error(error);
                    }
                })();
        });
    }
);




module.exports = router;