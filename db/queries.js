// Verdict 1, 2, 3: Legal, Ilegal, -
// Status 1, 2, 3: Aguardando processamento, Processado, Respondido
function insertNewWebsite(db, url, status, verdict, reason) {
    var req = db.query(
        "INSERT INTO Request(current_status) VALUES (?)",
        [status]);
    var evl = req.then( () => {
        return db.query(
        "INSERT INTO Evaluation(verdict, reason) VALUES (?, ?)",
        [verdict, reason])
    });
    return evl.then( () => {
        return db.query(
        "INSERT INTO Website(url, evaluation_id, request_id)\
            VALUES (?, ?, ?)",
        [url, evl.value().insertId, req.value().insertId])
    });
}

function updateWebsiteVerdict(db, id, verdict, reason) {
    return db.query(
        "SELECT evaluation_id FROM Website WHERE id = ?",
        [id]
    ).then( (res) => {
        evalId = res[0].evaluation_id;
        return db.query(
            "UPDATE Evaluation SET verdict = ?, reason = ? WHERE id = ?",
            [verdict, reason, evalId]
        );
    })
}

function updateWebsiteRequest(db, id, status) {
    return db.query(
        "SELECT request_id FROM Website WHERE id = ?",
        [id]
    ).then( (res) => {
        return setRequestStatus(db, res[0].request_id, status);
    })
}

function setRequestStatus(db, id, status) {
    return db.query(
        "UPDATE Request SET current_status = ? WHERE id = ?",
        [status, id]
    );
}

function setCompleteAllSites(db, sites) {
    sites.map((site) => {
        return db.query(
            "SELECT request_id FROM Website WHERE url = ?",
            [site]
        ).then( (res) => {
            return setRequestStatus(db, res[0].request_id, 3);
        });
    })
}

module.exports = {
    insertNewWebsite,
    updateWebsiteVerdict,
    updateWebsiteRequest,
    setCompleteAllSites
}
