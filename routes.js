let express = require('express');
//let model = require('./Database/db.js');
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

//add user
router.route('/addUser')
    .post((req,res) => {
        let user = req.user;
        console.log("db");
        model.addNewClient(testClientHarsh);
        res.send("user added");
});

//PUT update user location
router.route('/updateLocation')
    .put((req,res) => {
        let location = req.location;
        console.log("location");
        model.updateLocation(location);
        res.send("Location updated");
});

//GET friends in certain radius id

router.route('/getNearFriends')
    .get((req,res) => {
        let userId = req.userId;
        let radius = req.radius;
        let friends = model.getFriends(userId);
        let userLocation = model.getLocationById(userId);
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
        res.send(nearFriendsIds);
});

module.exports = router;