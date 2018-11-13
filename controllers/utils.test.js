const utils = require('./utils');

jest.mock('../db/queries');
jest.mock('./regexEvaluation');

const queries = require('../db/queries');
const regexEvaluation = require('./regexEvaluation');

beforeEach(() => {
    jest.clearAllMocks();
    queries.insertNewWebsite.mockImplementation(() => ({
        insertId: 12,
    }));
    regexEvaluation.mockImplementation(() => {
        return [null, null];
    });
})

describe('siteHash', () => {
    it('should return the right hash', () => {
        // arrange

        const site = 'www.uol.com.br';
        const verdict = 2;
        const reason = 'Prostituição';

        // act
        const response = utils.siteHash(site, verdict, reason);

        // asserts
        expect(response).toEqual({
            url: site,
            restrict: true,
            reasons: [reason],
        });
    });

})

describe('handleSite', () => {
    var db = null;
    var site = 'http://www.google.com';
    var body = 'Empty';
    it('should call queries.updateWebSiteRequest', async () => {
        await utils.handleSite(db, null, site, body);

        expect(queries.updateWebsiteRequest).toHaveBeenCalledWith(db, 12, 1);
        expect(queries.updateWebsiteRequest).toHaveBeenCalledTimes(1);
    });

    it('should call queries.updateWebsiteVerdict', async () => {
        await utils.handleSite(db, null, site, body);

        expect(queries.updateWebsiteVerdict).toHaveBeenCalled();
        expect(queries.updateWebsiteVerdict).toHaveBeenCalledTimes(1);
    });
    it('should return \"Erro\" if err', async () => {
        res = await utils.handleSite(db, 1, site, body);

        expect(res).toEqual([1, 'Erro ao acessar site']);
    })
    it('should call evaluateLegality if not err', async () => {
        await utils.handleSite(db, null, site, body);

        expect(regexEvaluation).toHaveBeenCalled();
    })
});
