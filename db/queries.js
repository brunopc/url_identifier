const mysql = require('mysql');
const fs = require('fs');

const config = {
    host: 'localhost',
    user: 'bpc',
    password: 'senha',
    database: 'URL_IDENTIFIER',
    // port: 3000
}

var Promise = require('bluebird');

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}


db = new Database(config);

// Verdict 1, 2, 3: Legal, Ilegal, -
// Status 1, 2, 3: Aguardando processamento, Processado, Respondido
function insertNewWebsite(url, status, verdict, reason) {
    var req = db.query(
        "INSERT INTO Request(current_status) VALUES (?)",
        [status]);
    var evl = req.then( () => {
        return db.query(
        "INSERT INTO Evaluation(verdict, reason) VALUES (?, ?)",
        [verdict, reason])
    });
    return evl.then( () => {
        // console.log("Insert website: " + url);
        return db.query(
        "INSERT INTO Website(url, evaluation_id, request_id)\
            VALUES (?, ?, ?)",
        [url, evl.value().insertId, req.value().insertId])
    }); 
}

function updateWebsiteVerdict(id, verdict, reason) {
    // console.log("Called to Website with id: " + id);
    return db.query(
        "SELECT evaluation_id FROM Website WHERE id = ?",
        [id]
    ).then( (res) => {
        evalId = res[0].evaluation_id;
        // console.log("Updating Evaluation id: " + evalId);
        return db.query(
            "UPDATE Evaluation SET verdict = ?, reason = ? WHERE id = ?",
            [verdict, reason, evalId]
        );
    }) 
}

function updateWebsiteRequest(id, status) {
    return db.query(
        "SELECT request_id FROM Website WHERE id = ?",
        [id]
    ).then( (res) => {
        return setRequestStatus(res[0].request_id, status);
    }) 
}

function setRequestStatus(id, status) {
    return db.query(
        "UPDATE Request SET current_status = ? WHERE id = ?",
        [status, id]
    );
}

function setCompleteAllSites(sites) {
    sites.map((site) => {
        return db.query(
            "SELECT request_id FROM Website WHERE url = ?",
            [site]
        ).then( (res) => {
            return setRequestStatus(res[0].request_id, 3);
        });
    })
}

module.exports = {
    Database,
    insertNewWebsite,
    updateWebsiteVerdict,
    updateWebsiteRequest,
    setCompleteAllSites
}
