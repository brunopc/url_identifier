const request = require('request');

function verifier(requestBody) {
    const sites = JSON.parse(requestBody['sites']);

    sites.map((site) => {
        console.log('scrapping: ', site);
        request(site, (err, res, body) => {
            console.log(res && res.statusCode);
            console.log(body);
            if (err) console.log(err);
        })
    })

    return 'oi';
}

module.exports = verifier; 
