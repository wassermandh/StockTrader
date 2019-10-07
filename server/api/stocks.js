const router = require('express').Router();
const { Stock } = require('../db/models');
module.exports = router;

router.get('/transactions', async (req, res, next) => {
  try {
    const allStocks = await req.user.getStocks();
    console.log(allStocks);
    res.send(allStocks);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (req.body.data.Note) {
      if (req.body.data.Note.slice(0, 5) === 'Thank') {
        let APICallErr = new Error();
        APICallErr.status = 502;
        throw APICallErr;
      }
    }
    const stock = req.body.data['Global Quote']['01. symbol'];
    const stockPrice = Number(req.body.data['Global Quote']['05. price']);
    const quantity = Number(req.body.quantity);
    const totalCost = stockPrice * quantity;
    const newBalance = req.user.dataValues.balance - totalCost;
    if (newBalance < 0) {
      let balanceError = new Error();
      balanceError.status = 501;
      throw balanceError;
    } else {
      await req.user.update({ balance: newBalance });
    }

    const newStock = await Stock.create({
      ticker: stock,
      priceAtPurchase: stockPrice,
      quantity,
    });
    await req.user.addStock(newStock);

    newStock.dataValues.totalCost = totalCost;
    res.send(newStock);
  } catch (err) {
    next(err);
  }
});
