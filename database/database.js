const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas','root','Gumm1904!',{
    host:'localhost',
    dialect: 'mysql'
});

module.exports = connection;
