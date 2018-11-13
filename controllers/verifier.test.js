const verifier = require('./verifier');

jest.mock('../db/queries');
jest.mock('./utils');
jest.mock('request-promise');
// jest.mock(JSON);

const db = require('../db/queries');
const utils = require('./utils');
const rp = require('request-promise');

beforeEach(() => {
    jest.clearAllMocks();
    rp.mockImplementation(async () => {
        return 1;
    })
    utils.handleSite.mockImplementation(async () => {
        return [null, null]
    })
})

describe('verifier', () => {
    s1 = "http://www.uol.com.br";
    s2 = "http://www.mundodovapor.com";
    callback = "http://localhost:3000/post";
    requestBody = { 
        "sites" : "[\""+s1+"\", \""+s2+"\"]", 
        "callback" : callback,
    };
    it('should make a request to the websites', async () => {
        await verifier(requestBody);

        expect(rp).toHaveBeenCalledWith(s1);
        expect(rp).toHaveBeenCalledWith(s2);
        expect(utils.siteHash).toHaveBeenCalled();
        expect(utils.handleSite).toHaveBeenCalled();
        expect(db.setCompleteAllSites).toHaveBeenCalled();
    });

})
