import axios from 'axios';
import history from '../history';
import { updateBalance } from './index';
import { alphavantageCall, apiKey } from '../../secrets';

const BUY_STOCK = 'BUY_STOCK';
const INCORRECT_TICKER = 'INCORRECT_TICKER';
const BALANCE_TOO_LOW = 'BALANCE_TOO_LOW';
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS';
const GOT_PORTFOLIO = 'GOT_PORTFOLIO';
const PORTFOLIO_API_THROTTLE = 'PORTFOLIO_API_THROTTLE';
const TOO_MANY_CALLS = 'TOO_MANY_CALLS';
const ADD_TO_PORTFOLIO = 'ADD_TO_PORTFOLIO';
const IS_PURCHASING = 'IS_PURCHASING';

const defaultStocks = {
  stocks: [],
  error: '',
  loadingMoreStocks: '',
  portfolio: { totalCost: 0, stocks: [] },
  grabbingPortfolio: true,
  purchasing: '',
};

//action creators
const buyStock = stock => {
  return {
    type: BUY_STOCK,
    stock,
  };
};

const isPurchasing = () => {
  return {
    type: IS_PURCHASING,
  };
};

const addToPortfolio = stock => {
  return {
    type: ADD_TO_PORTFOLIO,
    stock,
  };
};

const tooManyCalls = () => {
  return {
    type: TOO_MANY_CALLS,
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

const gotPorfolio = (stocks, totalCost) => {
  return {
    type: GOT_PORTFOLIO,
    stocks,
    totalCost,
  };
};

const gotTransactions = (stocks, totalCost) => {
  return {
    type: GOT_TRANSACTIONS,
    stocks,
    totalCost,
  };
};

const portfolioAPIThrottle = () => {
  return {
    type: PORTFOLIO_API_THROTTLE,
  };
};

export const apiCallHelper = async stock => {
  let dataToReturn;
  console.log(process.env.alphaVantageKey);
  try {
    if (process.env.alphaVantageKey) {
      dataToReturn = await axios.get(
        alphavantageCall(stock, process.env.alphaVantageKey)
      );
    } else {
      dataToReturn = await axios.get(alphavantageCall(stock, apiKey));
    }
    console.log(dataToReturn);
    return dataToReturn;
  } catch (err) {
    console.log(err);
  }
};

//thunks
export const buyingStock = (stock, quantity) => async dispatch => {
  try {
    dispatch(isPurchasing());
    let data = await apiCallHelper(stock);
    data = data.data;
    if (data['Error Message']) {
      dispatch(incorrectTicker());
    } else {
      const createdStock = await axios.post('/api/stocks/', { data, quantity });
      dispatch(buyStock(createdStock.data));
      dispatch(addToPortfolio(createdStock.data));
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

// export const addingToPortfolio = stock => async dispatch => {
//   try {
//     console.log(stock);
//     let stockToAdd = {};
//     const { data } = await axios.get(alphavantageCall(stock.ticker));
//     if (data.Note) {
//       dispatch(tooManyCalls());
//     }
//     const ticker = data['Global Quote']['01. symbol'];
//     const latestPrice = Number(data['Global Quote']['05. price']);
//     const openPrice = Number(data['Global Quote']['02. open']);
//     const trend = latestPrice - openPrice;
//     stockToAdd[ticker].latestPrice = latestPrice;
//     stockToAdd[ticker].openPrice = openPrice;
//     stockToAdd[ticker].trend = trend;
//   } catch (err) {
//     console.log(err);
//   }
// };
const trendDirection = trend => {
  if (trend < 0) {
    return 'neg';
  } else if (trend > 0) {
    return 'pos';
  } else {
    return 'neutral';
  }
};

export const gettingPortfolio = () => async dispatch => {
  try {
    let totalCost = 0;
    let { data: uniqueStocks } = await axios.get('/api/stocks/portfolio');
    console.log(uniqueStocks);
    const tickers = Object.keys(uniqueStocks);

    for (let i = 0; i < tickers.length; i++) {
      let stock = tickers[i];
      let data = await apiCallHelper(stock);
      data = data.data;
      if (data.Note) {
        dispatch(portfolioAPIThrottle());
      }
      const ticker = data['Global Quote']['01. symbol'];
      const latestPrice = Number(data['Global Quote']['05. price']);
      const openPrice = Number(data['Global Quote']['02. open']);
      const trend = latestPrice - openPrice;
      uniqueStocks[ticker].latestPrice = latestPrice;
      uniqueStocks[ticker].openPrice = openPrice;
      uniqueStocks[ticker].trend = trend;
      uniqueStocks[ticker].performance = trendDirection(trend);
      totalCost +=
        uniqueStocks[ticker].latestPrice * uniqueStocks[ticker].quantity;
    }
    dispatch(gotPorfolio(uniqueStocks, totalCost));
  } catch (err) {
    console.log(err);
  }
};

//reducer
export default function(state = defaultStocks, action) {
  switch (action.type) {
    case BUY_STOCK:
      return {
        ...state,
        stocks: [...state.stocks, action.stock],
        error: '',
        purchasing: 'Successfully Purchased!',
        loadingMoreStocks: '',
        portfolioRefreshThrottle: '',
      };
    case INCORRECT_TICKER:
      return { ...state, error: 'Ticker is incorrect', purchasing: '' };
    case ADD_TO_PORTFOLIO:
      let newPortfolio = { ...state.portfolio };
      if (newPortfolio.stocks[action.stock.ticker]) {
        newPortfolio.stocks[action.stock.ticker].quantity +=
          action.stock.quantity;
      } else {
        newPortfolio.stocks[action.stock.ticker] = action.stock;
      }
      let costToAdd =
        newPortfolio.stocks[action.stock.ticker].quantity *
        newPortfolio.stocks[action.stock.ticker].latestPrice;
      newPortfolio.totalCost += costToAdd;
      return { ...state, portfolio: newPortfolio };
    case BALANCE_TOO_LOW:
      return {
        ...state,
        error: 'Your balance is too low to purchase this',
        purchasing: '',
      };
    case GOT_TRANSACTIONS:
      return { ...state, stocks: action.stocks };
    case PORTFOLIO_API_THROTTLE:
      return {
        ...state,
        loadingMoreStocks:
          'Sorry, this API has limitations... only five calls can be made per minute... please wait one minute and click refresh for updated portfolio',
        grabbingPortfolio: false,
      };
    case GOT_PORTFOLIO:
      return {
        ...state,
        portfolio: { stocks: action.stocks, totalCost: action.totalCost },
        loadingMoreStocks: '',
        grabbingPortfolio: false,
      };
    case TOO_MANY_CALLS:
      return {
        ...state,
        error:
          'Too many calls have been made to the API. Please try again in one minute',
        purchasing: '',
      };
    case IS_PURCHASING:
      return {
        ...state,
        purchasing: 'Attempting to purchase...',
        error: '',
      };
    default:
      return state;
  }
}
