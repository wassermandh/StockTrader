const router = require('express').Router();
const { Stock } = require('../db/models');
const axios = require('axios');
module.exports = router;

router.get('/transactions', async (req, res, next) => {
  try {
    const allStocks = await req.user.getStocks();
    res.send(allStocks);
  } catch (err) {
    next(err);
  }
});

router.get('/portfolio', async (req, res, next) => {
  try {
    const userStocks = await req.user.getStocks();
    let uniqueStocks = {};

    userStocks.forEach(stock => {
      if (uniqueStocks[stock.dataValues.ticker]) {
        let newQuant =
          uniqueStocks[stock.dataValues.ticker].quantity +
          stock.dataValues.quantity;
        let newValue = { quantity: newQuant };
        uniqueStocks[stock.dataValues.ticker] = newValue;
      } else {
        uniqueStocks[stock.dataValues.ticker] = {
          quantity: stock.dataValues.quantity,
        };
      }
    });

    res.send(uniqueStocks);
  } catch (err) {
    next(err);
  }
});

const trendDirection = trend => {
  if (trend < 0) {
    return 'neg';
  } else if (trend > 0) {
    return 'pos';
  } else {
    return 'neutral';
  }
};

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
    const openPrice = Number(req.body.data['Global Quote']['02. open']);
    const trend = stockPrice - openPrice;
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
    newStock.dataValues.openPrice = openPrice;
    newStock.dataValues.trend = trend;
    newStock.dataValues.performance = trendDirection(trend);
    newStock.dataValues.latestPrice = stockPrice;
    res.send(newStock);
  } catch (err) {
    next(err);
  }
});
