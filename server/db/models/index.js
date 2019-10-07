const User = require('./user');
const Stock = require('./stock');

User.belongsToMany(Stock, { through: 'User_Stock' });
Stock.belongsToMany(User, { through: 'User_Stock' });

module.exports = {
  User,
  Stock,
};
