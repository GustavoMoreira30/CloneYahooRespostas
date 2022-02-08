const Sequelize = require("sequelize");
const connection = require("./database");

//Definindo os campos da tabela
const Pergunta = connection.define("perguntas",{
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//Indicando a criação da tabela, evitando forçar a criação mais de uma vez
Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;
