% URL Identifier
% Bruno Pasqualotto Cavalar (8941172)

# O Programa

O programa busca identificar, através de expressões regulares, se um
conjunto de sites (enviados como no enunciado) contém comércio ilegal ou
não. O programa assume que estamos já recebendo um site de ecommerce.

# Como subir o ambiente de desenvolvimento

## Instalação

1. Instale NodeJS v8.12.0
2. Instale MySQL v14.14
3. Execute `npm install`

Para criar o banco de dados, crie um usuário no MySQL com 
username `bpc`
e senha `senha`. Depois, basta rodar 

```
mysql -u bpc -p < db/migrations.sql.
```

Esse código irá criar o banco de dados `URK_IDENTIFIER`, onde o
aplicativo irá atualizar com os resultados obtidos.

# Uso

1. Basta rodar `nodemon main.js` e o programa estará rodando em
   `http://localhost:3000`.
1. Para acessar o banco de dados `URL_IDENTIFIER`, usado no sistema,
   entre com usuário `bpc` e senha `senha`.
1. Envie requisições **POST** para '**/verify'** com entrada JSON do
   seguinte modo.

```
{
   “sites”: [
       “http://www.paginalucrativa.com.br/?id=41635”,
       “http://www.paudefogo.com.br”,
       “http://www.csvidatv.com.br”,
       “http://www.morangovip.com.br”
   ],
   “callback”: “http://calback.com.br/teste"
}
```

   O programa irá devolver um JSON indicando quais sites são restritos ou
   não, e irá registrar no banco de dados o veredito final ("Legal" ou
   "Ilegal" e qual o motivo, como "Prostituição" ou "Cigarros
   eletrônicos").
   O JSON seguirá o seguinte padrão:

```
{
    “sites”: [
        {“url”: “http://www.paginalucrativa.com.br/?id=41635”,
        “restrict”: true,
        “reasons”: [“reason 1”, “reason 2”, “reason 3”]},
        {“url”: “http://www.paudefogo.com.br”, “restrict”: true, “reasons”: [“other
        reason”]},
        {“url”: “http://www.google.com.br”, “restrict”: false, “reasons”: []},
    ]
}
```

1. Esse resultado também será enviado numa requisição POST para a
   rota definida em `callback`.
1. Enquanto a análise estiver sendo feita, o usuário pode
   consultar o banco de dados `URL_IDENTIFIER` para acompanhar o
   desenvolvimento do processo.
1. O status poderá ser "Aguardando
   processamento" (quando o site acabou de ser recebido), "Processado"
   (quando a resposta já foi obtida, mas não submetida ainda) e "Respondido"
   (quanto todo o processo já chegou ao fim.

1. Você pode consultar o banco de dados
   `URL_IDENTIFIER` 
   Para cada website, podemos ver sua url, o estado da
   requisição (Aguardando Processamento, Processado ou Respondido) e
   a avaliação final (Legal ou Ilegal).
   Para cada avaliação, podemos ver sua classificação (por exemplo,
   "Armas de fogo", "Prostituição" ou "Nada ilegal encontrado").
1. Para testar, basta rodar `npm test`. Para ver a cobertura de testes,
   rode `npm coverage`. Se quiser uma visualização mais amigável, acesse
   `coverage/lcov-report/index.html` depois de rodar `npm coverage`.

## API

1. **POST /verify** - enviar a requisição com os sites, como explicado no
   enunciado

# Código

## Main

1. O arquivo `main.js` faz o setup do servidor e estabelece o
   endpoint `/verify` para as requisições POST.
1. A requisição **POST** feita para o `/verify` é enviada ao 
   `controllers/verifier.js`, que irá retornar a resposta

## Controllers
1. Em 
   `verifier.js`,
   nós recebemos um corpo JSON (requestBody) enviado pelo cliente, e
   então avaliamos para cada site recebido se ele é ilegal ou não
   (mandando para o `utils.handleSite.js`).
   Colocamos o veredito no banco de dados e respondemos com um hash
   seguindo o modelo de resposta colocado acima.
1. Em 
   `utils.js`,
   nós temos a função `handleSite`,
   que pega um site e o seu corpo, manda para o avaliador
   `regexEvaluation` e coloca a avaliação no banco de dados.
   A função `siteHash` constroi o hash do site com seu respectivo
   veredito e classificação.
1. Em
   `regexEvaluation.js`,
   a função
   `regexEvaluation(body)`
   aplica expressõres regulares na string `body` e retorna se ela
   contém algo ilegal ou não, explicando a sua classificação.

## DB

1. Em
   `migrations.sql`,
   descrevemos as `migrations` iniciais que irão construir o banco
   de dados como desejamos.
1. Em
   `database.js`,
   construímos uma classe ao redor do banco de dados `mysql`,
   para transformar em `Promise` as operações assíncronas do banco de
   dados. Assim, podemos usar operações tais quais `await` com o
   banco de dados.
1. Em
   `queries.js`,
   construímos vários métodos que serão usados pelos controllers para
   atualizar o banco de dados.

# Bugs

Há apenas um bug identificado.

1. Ao final da função `verifier()`
   em `controllers/verifier.js`, quando fazemos
   `queries.setCompleteAllSites(db, sites)`,
   nós atualizamos todos os `Website`s do banco de dados que tem a
   url igual as que recebemos. Mas pode acontecer que haja mais
   de um site com a mesma url, porque a chave primária da tabela
   é a id, e não a url. Deste modo, não atualizaremos os sites da
   requisição correspondente. É possível reproduzir esse bug quando
   fazemos várias requisições com o mesmo conjunto de urls.
