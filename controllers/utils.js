const db = require('../db/queries')
const regexEvaluation = require('./regexEvaluation');

async function handleSite(err, site, body) {
    siteDb = await db.insertNewWebsite(site, 1, 3, "Aguardando\
        processamento");
    if (err) 
        [verdict, reason] = [1, "Erro ao acessar site"];
    else
        [verdict, reason] = regexEvaluation(body);
    db.updateWebsiteRequest(siteDb.insertId, 1);
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

module.exports = {handleSite, siteHash}
