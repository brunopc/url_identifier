const express = require('express');
const bodyParser = require('body-parser')
const verifier = require('./controllers/verifier');
// const mysql = require('mysql');
// const { connect } = require('./db/queries');
const db = require('./db/queries');
const mysql = require('mysql');

const app = express();
const port = 3000;

// db.connect();
db.insertNewWebsite("url.com", 1, 2, "Anything");


app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/verify', (req, res) => {
    let response = verifier(req.body);
    res.send(response);
});

app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`));
