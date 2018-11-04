const request = require('request');
const rp = require('request-promise');
const db = require('../db/queries')

// const express = require('express');
// const app = express();

async function handleSite(err, site, body) {
    siteDb = await db.insertNewWebsite(site, 1, 3, "Aguardando\
        processamento");
    if (err) 
        [verdict, reason] = [1, "Erro ao acessar site"];
    else
        [verdict, reason] = await evaluateLegality(body);
    db.updateWebsiteRequest(siteDb.insertId, 2);
    db.updateWebsiteVerdict(siteDb.insertId, verdict, reason);
    console.log("finished response " + site);
    return [verdict, reason]
}

function siteHash(site, verdict, reason) {
    var hash = {};
    hash["url"] = site;
    hash["restrict"] = verdict == 2;
    hash["reasons"] = [reason];
    return hash;
}

async function verifier(requestBody) {
    const sites = JSON.parse(requestBody['sites']);

    answerAux = sites.map((site, index) => {
        console.log('scrapping: ', site);
        var siteAnswer = {}
        return rp(site).then(async (err, res, body) => {
            response = await handleSite(null, site, body);
            return siteHash(site, response[0], response[1]);
        }).catch(async (err) => {
            console.log("Error accessing " + site);
            response = await handleSite(true, site, "");
            return siteHash(site, response[0], response[1]);
        });
    });

    var hash = {};
    hash["sites"] = await Promise.all(answerAux);

    return hash;
}

function timeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function evaluateLegality(body) {
    return [2, "Absolute illegal", "Everything is illegal. \
            Down with the internet!"];
}

module.exports = verifier; 
