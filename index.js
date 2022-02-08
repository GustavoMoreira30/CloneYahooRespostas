const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database"); //Exportando o banco de dados
const Perguntas = require("./database/Perguntas");
const Resposta = require("./database/Resposta");
const { response } = require("express");


//Conectando ao banco de dados 
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

//Informando ao Express para usar o EJS como view engine
app.set('view engine','ejs');
app.use(express.static('public')); //Iniciando arquivos estáticos

//Body-Parser
app.use(bodyParser.urlencoded({extended: false})); //Permite o envio dos dados para a tradução do Body-Parser em javascript
app.use(bodyParser.json()); //Ler os dados do formulário em forma json

//Rotas
app.get("/",(req, res) =>{
    Perguntas.findAll({raw: true, order:[
        ['id', 'DESC'] //ASC = crescente e DESC = decrescente => ordenação
    ]}).then(pergunta => {  //SELECT * ALL FROM perguntas
        res.render("index",{
            pergunta: pergunta
        });
    });    
});

app.get("/perguntar",(req, res) =>{

    res.render("perguntar");
});

app.post("/salvarpergunta",(req, res) =>{
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Perguntas.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});
app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Perguntas.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ //Pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{ //Não encontrada
            res.redirect("/");
        }
    });
})
app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.listen(8080,() =>{console.log("App rodando!");});