const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');


var port = 3000;
var url ="http://localhost:3000";

const app = express();

app.get('/', (req,res) => {
    console.log("hello world");
    res.send({message : "Hello"});
});

app.post('/users', function(req, res) {
    console.log("body", req.body);
});


app.listen(port, () => console.log("SERVER STARTED..."));
