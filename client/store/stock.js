import axios from 'axios';
import history from '../history';
import { updateBalance } from './index';
import alphavantageCall from '../../secrets';
import { runInNewContext } from 'vm';

const BUY_STOCK = 'BUY_STOCK';
const INCORRECT_TICKER = 'INCORRECT_TICKER';
const BALANCE_TOO_LOW = 'BALANCE_TOO_LOW';
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS';
const TOO_MANY_API_CALLS = 'TOO_MANY_API_CALLS';
const GOT_PORTFOLIO = 'GOT_PORTFOLIO';
const PORTFOLIO_API_THROTTLE = 'PORTFOLIO_API_THROTTLE';

const defaultStocks = {
  stocks: [],
  error: '',
  loadingMoreStocks: '',
  portfolio: [],
};

//action creators
const buyStock = stock => {
  return {
    type: BUY_STOCK,
    stock,
  };
};

const incorrectTicker = () => {
  return {
    type: INCORRECT_TICKER,
  };
};

const balanceTooLow = () => {
  return {
    type: BALANCE_TOO_LOW,
  };
};

const gotPorfolio = stocks => {
  return {
    type: GOT_PORTFOLIO,
    stocks,
  };
};

const gotTransactions = stocks => {
  return {
    type: GOT_TRANSACTIONS,
    stocks,
  };
};

const tooManyCalls = () => {
  return {
    type: TOO_MANY_API_CALLS,
  };
};

const portfolioAPIThrottle = () => {
  return {
    type: PORTFOLIO_API_THROTTLE,
  };
};

//thunks
export const buyingStock = (stock, quantity) => async dispatch => {
  try {
    const { data } = await axios.get(alphavantageCall(stock));
    if (data['Error Message']) {
      dispatch(incorrectTicker());
    } else {
      const createdStock = await axios.post('/api/stocks/', { data, quantity });
      dispatch(buyStock(createdStock.data));
      dispatch(updateBalance(createdStock.data.totalCost));
    }
  } catch (err) {
    console.log(err);
    if (err.message === 'Request failed with status code 501') {
      dispatch(balanceTooLow());
    } else if (err.message === 'Request failed with status code 502') {
      dispatch(tooManyCalls());
    }
  }
};

export const gettingTransactions = () => async dispatch => {
  try {
    const { data } = await axios.get('api/stocks/transactions');
    dispatch(gotTransactions(data));
  } catch (err) {
    console.log(err);
  }
};

export const gettingPortfolio = () => async dispatch => {
  try {
    const { data: uniqueStocks } = await axios.get('/api/stocks/portfolio');
    const tickers = Object.keys(uniqueStocks);

    for (let i = 0; i < tickers.length; i++) {
      if (i % 5 === 0) {
        setTimeout(() => {
          dispatch(portfolioAPIThrottle());
        });
      }
      let stock = tickers[i];
      const { data } = await axios.get(alphavantageCall(stock));
      const ticker = data['Global Quote']['01. symbol'];
      const latestPrice = Number(data['Global Quote']['05. price']);
      const openPrice = Number(data['Global Quote']['02. open']);
      const trend = latestPrice - openPrice;
      uniqueStocks[ticker].latestPrice = latestPrice;
      uniqueStocks[ticker].openPrice = openPrice;
      uniqueStocks[ticker].trend = trend;
    }
    dispatch(gotPorfolio(uniqueStocks));
  } catch (err) {
    console.log(err);
  }
};

//reducer
export default function(state = defaultStocks, action) {
  switch (action.type) {
    case BUY_STOCK:
      return {
        stocks: [...state.stocks, action.stock],
        error: '',
      };
    case INCORRECT_TICKER:
      return { ...state, error: 'Ticket is incorrect' };
    case BALANCE_TOO_LOW:
      return { ...state, error: 'Your balance is too low to purchase this' };
    case GOT_TRANSACTIONS:
      return { ...state, stocks: action.stocks };
    case TOO_MANY_API_CALLS:
      return { ...state, error: 'The API has been throttled. Sorry!' };
    case PORTFOLIO_API_THROTTLE:
      return {
        ...state,
        error: '',
        loadingMoreStocks:
          'Sorry, this API has limitations... every 5 unique stocks takes one additionam minute... please wait',
      };
    case GOT_PORTFOLIO:
      return {
        ...state,
        error: '',
        portfolio: action.stocks,
      };
    default:
      return state;
  }
}
