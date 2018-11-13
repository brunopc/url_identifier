const queries = require('./queries');
var Promise = require('bluebird');

class Database {
    constructor() {
        this.me = 1;
    }
    query() {
        return new Promise(resolve => resolve({
            insertId : 1,
            0: {evaluation_id : 2, request_id: 3}
        }))
    }
}

describe('insertNewWebsite', () => {
    db = new Database();
    url = "http://www.google.com";
    status = 1;
    verdict = 2;
    reason = "Não gostei";
    it('should make a query', async () => {
        // arrange
        jest.spyOn(db, "query");

        // act
        await queries.insertNewWebsite(db, url, status, verdict, reason);

        // asserts
        expect(db.query).toHaveBeenCalledTimes(3);
    });
})


describe('updateWebsiteVerdict', () => {
    db = new Database();
    id = 5;
    verdict = 2;
    reason = "Não gostei";
    it('should make a query', async () => {
        jest.spyOn(db, "query");
        await queries.updateWebsiteVerdict(db, id, verdict, reason);
        expect(db.query).toHaveBeenCalled();
    });
})


describe('updateWebsiteRequest', () => {
    db = new Database();
    id = 5;
    status = 1;
    it('should make a query', async () => {
        jest.spyOn(db, "query");
        await queries.updateWebsiteRequest(db, id, status);
        expect(db.query).toHaveBeenCalled();
    });
})



describe('setCompleteAllSites', () => {
    db = new Database();
    id = 5;
    sites = ["www.google.com", "uol.com.br"];
    it('should make a query', async () => {
        jest.spyOn(db, "query");
        await queries.setCompleteAllSites(db, sites);
        expect(db.query).toHaveBeenCalled();
    });
})
