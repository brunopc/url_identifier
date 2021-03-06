# Url Identifier

- github: brunopc/url_identifier.git
* [Vídeo de explicação do código](https://www.youtube.com/watch?v=dlXqqqJI_ek)
* Uma documentação mais detalhada pode ser encontrada em
  `/docs/docs.md` ou em
  [pdf](https://www.dropbox.com/s/pfzc85yzzedi4ad/docs.pdf?dl=0).

O projeto busca identificar, através de expressões regulares, se um
conjunto de sites (enviados como no enunciado) contém comércio ilegal ou
não. O programa assume que estamos já recebendo um site de ecommerce.

# Como subir o ambiente de desenvolvimento

## Instalação

1. Instale NodeJS v8.12.0
2. Instale MySQL v14.14
3. Execute `npm install`

Para criar o banco de dados, crie um usuário no MySQL com username "bpc"
e senha "senha". Depois, basta rodar 

```
mysql -u bpc -p < db/migrations.sql.
```

## Uso

1. Basta rodar `nodemon main.js` e o programa estará rodando em
   `http://localhost:3000`.
1. Envie requisições **POST** para '**/verify'** com entrada JSON como
   especificado no enunciado. 
   O programa irá responder também no modelo
   JSON também como especificado no enunciado, de dois modos: primeiro
   para o que fez a requisição POST, e, segundo, fazendo uma requisição
   POST no callback que for enviado.  
1. Você pode consultar o banco de dados
   `URL_IDENTIFIER` 
   (usuário: bpc, senha: senha)
   para ver os resultados obtidos
   pelo programa. Para cada website, podemos ver sua url, o estado da
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

# O que faltou na Fase 2

Eu planejava fazer uma interface gráfica de interação com o programa, mas
infelizmente não consegui. Achei muito difícil testar
funções com efeitos colaterais, como são os bancos de dados, mas consegui
testar as queries, fazendo mock do DB.

