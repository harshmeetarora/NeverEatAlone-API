let express = require('express');
let router  = express.Router();
let model = require('./Database/db.js');


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

module.exports = router;