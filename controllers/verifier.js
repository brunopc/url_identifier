const request = require('request');
const db = require('../db/queries')

function verifier(requestBody) {
    const sites = JSON.parse(requestBody['sites']);

    sites.map((site) => {
        console.log('scrapping: ', site);
        request(site, (err, res, body) => {
            if (err) console.log(err);
            code = res && res.statusCode;
            console.log("status code: " + code);
            // console.log(body);
            db.insertNewWebsite(site, 1).then( (res) => {
                console.log("id: " + res.insertId);
            });
            [verdict, reason] = evaluateLegality(body);
        })
    });

    return 'oi';
}

function evaluateLegality(body) {
    return [false, "Everything is illegal. Down with the internet!"];
}

module.exports = verifier; 
