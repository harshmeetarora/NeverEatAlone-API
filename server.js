const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
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

app.post('/idHash', (req,res) => {
    //var fbID = req.id;
    //console.log(fbID);
    var fbID = 13264652373;
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
//     res.send("Hello");
//     });
// });

app.listen(port, () => console.log("SERVER STARTED..."));
