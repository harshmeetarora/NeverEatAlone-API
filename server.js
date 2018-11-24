const express = require('express');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');


var port = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Route Files
let router = require('./routes');
app.use(router);

app.listen(port, () => console.log("SERVER STARTED..."));
