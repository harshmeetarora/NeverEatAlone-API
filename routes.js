let express = require('express');
let model = require('./Database/db.js');
let yelpAPI = require ('./yelp-api.js');
let Hashids = require('hashids');
let geolib = require('geolib');
let yelp = require('yelp-fusion');

var hashids = new Hashids();

let router  = express.Router();



//test 
router.route('/test')
    .get((req,res) => {
        console.log("check");
        res.send("Hello");
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

///yelp api call
router.route('/yelp')
    .get((req,res) => {
    var latitude = '49.246292' ;
    var longitude = '-123.116226' ;
    var radius ='';
    var term = "bar";
        var getYelpRecommendation = yelpAPI.getYelpRecommendation(latitude, longitude, radius, term);
        res.send({'Recommedations' : getYelpRecommendation});
});


module.exports = router;