const express = require('express');
const bodyParser = require('body-parser')
const verifier = require('./controllers/verifier');
// const mysql = require('mysql');
const { connectDB } = require('./db/queries');

const app = express();
const port = 3000;

connectDB();

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

// const bla = (arg) => {
//   console.log(arg);
// }
//
// bla('oi0')
//

app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`));
