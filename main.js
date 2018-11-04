const express = require('express');
const bodyParser = require('body-parser')
const verifier = require('./controllers/verifier');
// const mysql = require('mysql');
// const { connect } = require('./db/queries');
const db = require('./db/queries');
const mysql = require('mysql');
const request = require('request');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/verify', async (req, res) => {
    let response = await verifier(req.body);
    const callback = JSON.parse(req.body['callback']);
    request.post( {
            uri: callback,
            form: response,
            json: true,
            headers: {
                "content-type": "application/json",
            },
        },
        (err, res, body) => {
            if (err) throw err;
        }
    );
    res.send(response);
});

app.post('/post', (req, res) => {
    console.log(JSON.stringify(req.body));
    res.send("Nice job!");
});

app.listen(port, () => 
    console.log(`Example app listening on port ${port}!`));
