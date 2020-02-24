const Sequelize = require('sequelize');
const database = new Sequelize('instashare', 'root', 'example', {
  host: 'db',
  dialect: 'mysql',
});

module.exports = database;