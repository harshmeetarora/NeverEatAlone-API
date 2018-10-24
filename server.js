const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');


var port = process.env.PORT || 3000;

const app = express();

app.get('/test', (req,res) => {
    res.send("Hello");
});

// app.post('/users', function(req, res) {
//     console.log("body", req.body);
// });


app.listen(port, () => console.log("SERVER STARTED..."));
