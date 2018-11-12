const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');

const testClientHarsh = {
	name: "Harsh",
	id : 7,
	age: "22",
};

console.log("AAAAAAAAAAAAAAAHHHHHHHHHGGGGHHHHHRRRRR");

var port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
	extended: true
}))


// app.get('/test', (req,res) => {
//     res.send("Hello");
// });
// Route Files
let router = require('./routes');
app.use(router);

app.listen(port, () => console.log("SERVER STARTED..."));
