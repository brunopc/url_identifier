const request = require('request');
const rp = require('request-promise');
const db = require('../db/queries')

// const express = require('express');
// const app = express();
//

illegalRegs = {
    "Armas de fogo" : [
        1,
        /Pistola Taurus/i,
        /Rev(o|ó)lver Taurus/i,
        /(Carabina|Espingarda) Rossi/i
    ],
    "Prostituição" : [
        3,
        /acompanhante/i,
        /garot(a|o)/i,
        /maravilhosa/i,
        /vip/i,
        /de luxo/i,
        /sexo/i,
        /putaria/i,
        /de programa/i,
        /t-girl/i,
        /transsex/i,
        /boneca/i,
        /shemale/i,
        /travesti/i
    ],
    "Cigarros" : [
        1,
        /cigarros? eletr(o|ô)nicos?/i,
        /marlboro/i,
        /cigarro/i,
    ],
    "Remédios" : [
        1,
        /cytotec/i,
        /aborto/i,
    ],
    "Serviços de card sharing" : [
        3,
        /(CS|card sharing|card-sharing|cardsharing)/i,
        /TV/i,
        /HD/i,
        /canais/i,
        /(estabilidade)|(estável)/i,
        /sina(l|is)/i,
    ]
}

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

    answerAux = sites.map((site) => {
        console.log('scrapping: ', site);
        return rp(site).then(async (body) => {
            [verdict, reason] = await handleSite(null, site, body);
            return siteHash(site, verdict, reason);
        }).catch(async (err) => {
            console.log("Error accessing " + site);
            [verdict, reason] = await handleSite(true, site, "");
            return siteHash(site, verdict, reason);
        });
    });

    var hash = {};
    hash["sites"] = await Promise.all(answerAux);
    db.setCompleteAllSites(sites);

    return hash;
}

function timeOut(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function evaluateLegality(body) {
    var classification = "Nada ilegal encontrado";
    var verdict = 1;
    for (cl in illegalRegs) {
        var regs = illegalRegs[cl];
        var num = regs[0];
        regs = regs.slice(1);
        if (regs.map((reg) => reg.test(body)).reduce((a,b) => a+b) >= num) {
            classification = cl;
            verdict = 2;
            break;
        }
    }
    return [verdict, classification];
}

module.exports = verifier; 
