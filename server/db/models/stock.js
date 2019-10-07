const Sequelize = require('sequelize');
const db = require('../db');

const Stock = db.define('stock', {
  ticker: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  priceAtPurchase: {
    type: Sequelize.DECIMAL,
    allowNull: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

module.exports = Stock;
