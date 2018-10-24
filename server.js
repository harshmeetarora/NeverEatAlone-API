const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const model = require('./Database/db.js');
var Hashids = require('hashids');
var hashids = new Hashids();



const testClientHarsh = {
	name: "Harsh",
	id : 7,
	age: "22",
}

var port = process.env.PORT || 3000;

const app = express();


app.get('/test', (req,res) => {
    res.send("Hello");
});







// model.callDB(model.addNewClient, testClientHarsh)
// .then(() => {
// console.log ("OOOOOOOOO");
// res.send("Hello");
// });


// model.callDB(model.addNewClient, testClientHarsh)
// .then(() => {
// console.log ("OOOOOOOOO");
// res.send("Hello");
// });






app.get('/idHash', (req,res) => {
    var fbID = req.id;
    //var fbID = 13264652373;
    var hashId = hashids.encode(fbID);
    console.log(hashId);
    res.send(JSON.stringify({
        'id' : hashId
        }));
});






// app.get('/addUser', (req,res) => {

//     //var user = req.user;
//     console.log("db");
//     model.callDB(model.addNewClient, testClientHarsh)
//     .then(() => {
//     console.log ("OOOOOOOOO");
//     res.send("Hello");
//     });
// });

// app.post('/users', function(req, res) {
//     console.log("body", req.body);
// });
app.listen(port, () => console.log("SERVER STARTED..."));
