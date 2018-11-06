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
        /TV/,
        /HD/,
        /canais/i,
        /(estabilidade)|(estável)/i,
        /sina(l|is)/i,
    ]
}

function regexEvaluation(body) {
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

module.exports = regexEvaluation
