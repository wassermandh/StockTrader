const Sequelize = require('sequelize');

const db = new Sequelize(`postgres://localhost:5432/stock_trader`, {
  logging: false,
});

module.exports = db;
