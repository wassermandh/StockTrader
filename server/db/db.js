const Sequelize = require('sequelize');

const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/stock_trader`,
  {
    logging: false,
  }
);

module.exports = db;
