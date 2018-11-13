const rp = require('request-promise');
const queries = require('../db/queries')
const utils = require('./utils');
const database = require('../db/database');

const config = {
    host: 'localhost',
    user: 'bpc',
    password: 'senha',
    database: 'URL_IDENTIFIER',
}

db = new database(config);

async function verifier(requestBody) {
    const sites = JSON.parse(requestBody['sites']);

    answerAux = sites.map((site) => {
        console.log('scrapping: ', site);
        return rp(site).then(async (body) => {
            [verdict, reason] = await utils.handleSite(db, null, site, body);
            return utils.siteHash(site, verdict, reason);
        }).catch(async (err) => {
            console.log("Error accessing " + site);
            [verdict, reason] = await utils.handleSite(db, true, site, "");
            return utils.siteHash(site, verdict, reason);
        });
    });

    var hash = {};
    hash["sites"] = await Promise.all(answerAux);
    queries.setCompleteAllSites(db, sites);

    return hash;
}


module.exports = verifier;
