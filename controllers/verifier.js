const request = require('request');
const db = require('../db/queries')


function verifier(requestBody) {
    const sites = JSON.parse(requestBody['sites']);

    sites.map((site) => {
        console.log('scrapping: ', site);
        request(site, (err, res, body) => {
            if (err) console.log(err);
            code = res && res.statusCode;
            // console.log("status code: " + code);
            // console.log(body);
            db.insertNewWebsite(site, 1, 3, "Aguardando\
                processamento").then( (res) => {
                [verdict, reason] = evaluateLegality(body);
                db.updateWebsiteVerdict(res.insertId, verdict, reason);
            });
        })
    });
    return 'oi';
}

function evaluateLegality(body) {
    return [2, "Absolute illegal", "Everything is illegal. \
            Down with the internet!"];
}

module.exports = verifier; 
