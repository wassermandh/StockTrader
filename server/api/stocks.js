const router = require('express').Router();
const { Stock } = require('../db/models');
module.exports = router;

router.post('/', async (req, res, next) => {
  try {
    const stock = req.body.data['Global Quote']['01. symbol'];
    const stockPrice = Number(req.body.data['Global Quote']['05. price']);
    const quantity = Number(req.body.quantity);
    const totalCost = stockPrice * quantity;

    const newStock = await Stock.create({
      ticker: stock,
      priceAtPurchase: stockPrice,
      quantity,
    });
    await req.user.setStocks(newStock);
    const newBalance = req.user.dataValues.balance - totalCost;
    await req.user.update({ balance: newBalance });
    newStock.dataValues.totalCost = totalCost;
    res.send(newStock);
  } catch (err) {
    next(err);
  }
});
