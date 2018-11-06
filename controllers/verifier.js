const rp = require('request-promise');
const db = require('../db/queries')
const utils = require('./utils');

async function verifier(requestBody) {
    const sites = JSON.parse(requestBody['sites']);

    answerAux = sites.map((site) => {
        console.log('scrapping: ', site);
        return rp(site).then(async (body) => {
            [verdict, reason] = await utils.handleSite(null, site, body);
            return utils.siteHash(site, verdict, reason);
        }).catch(async (err) => {
            console.log("Error accessing " + site);
            [verdict, reason] = await utils.handleSite(true, site, "");
            return utils.siteHash(site, verdict, reason);
        });
    });

    var hash = {};
    hash["sites"] = await Promise.all(answerAux);
    db.setCompleteAllSites(sites);

    return hash;
}


module.exports = verifier;
