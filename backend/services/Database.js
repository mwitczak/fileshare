const Sequelize = require('sequelize');
const database = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
  host: 'db',
  dialect: 'mysql',
});

module.exports = database;