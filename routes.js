let express = require('express');
let model = require('./Database/db.js');
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
        let user = JSON.parse(req);
        console.log(user);
        model.addNewClient(user);
        res.send("user added");
});

//PUT update user location
// router.route('/updateLocation')
//     .put((req,res) => {
//         let id = req.id;
//         let location = req.location;
//         console.log("location");
//         model.updateLocation(id, location);
//         res.send({'location' : location});
// });

router.route('/updateLocation')
    .put((req,res) => {
        let id = req.id;
        let location = req.location;
        console.log("location");
        
        var promise = model.updateLocation(id, location);
        promise.then(function() {
            res.send("user added");
        }, function(err) {
            res.send(err)
        });
        res.send({'location' : location});
});


//GET friends in certain radius id
router.route('/getNearFriends')
    .get((req,res) => {
        let userId = req.userId;
        let radius = req.radius;
        var nearFriendsIds = getNearFriends(userId, radius);
        res.send(nearFriendsIds);
});

//get free friends near me
function getNearFriends(id, radius){
    let friends = model.findClientById(userId).friends;
        let userLocation = model.getLocation(userId);
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

//get time
function getTime(){

}

module.exports = router;