const queries = require('../db/queries')
const regexEvaluation = require('./regexEvaluation');

async function handleSite(db, err, site, body) {
    siteDb = await queries.insertNewWebsite(db, site, 1, 3, "Aguardando\
        processamento");
    if (err) 
        [verdict, reason] = [1, "Erro ao acessar site"];
    else
        [verdict, reason] = regexEvaluation(body);
    queries.updateWebsiteRequest(db, siteDb.insertId, 1);
    queries.updateWebsiteVerdict(db, siteDb.insertId, verdict, reason);
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
