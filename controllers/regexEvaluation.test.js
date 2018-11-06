const regexEvaluation = require('./regexEvaluation');

describe('regexEvaluation', () => {
    it('should return the right verdict and classification', () => {
        const body = "carabina rossi"

        const response = regexEvaluation(body);

        expect(response).toEqual( [2, "Armas de fogo"]);
    });
    it('should return the right verdict and classification', () => {
        const body = "pesquisas do bem"

        const response = regexEvaluation(body);

        expect(response).toEqual( [1, "Nada ilegal encontrado"]);
    });
})

