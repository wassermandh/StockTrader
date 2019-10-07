import axios from 'axios';
import history from '../history';

const BUY_STOCK = 'BUY_STOCK';
const INCORRECT_TICKER = 'INCORRECT_TICKER';
const BALANCE_TOO_LOW = 'BALANCE_TOO_LOW';
const GOT_TRANSACTIONS = 'GOT_TRANSACTIONS';

const defaultStocks = { stocks: [], error: '' };

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

const gotTransactions = stocks => {
  return {
    type: GOT_TRANSACTIONS,
    stocks,
  };
};

//thunks
export const buyingStock = (stock, quantity) => async dispatch => {
  try {
    // const { data } = await axios.get(
    //   `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=
    // );
    const data = {
      'Global Quote': {
        '01. symbol': 'MSFT',
        '02. open': '137.1400',
        '03. high': '138.1800',
        '04. low': '137.0200',
        '05. price': '137.1200',
        '06. volume': '12682685',
        '07. latest trading day': '2019-10-07',
        '08. previous close': '138.1200',
        '09. change': '-1.0000',
        '10. change percent': '-0.7240%',
      },
    };
    if (data['Error Message']) {
      dispatch(incorrectTicker());
    } else {
      const createdStock = await axios.post('/api/stocks/', { data, quantity });
      dispatch(buyStock(createdStock.data));
    }
  } catch (err) {
    if (err.message === 'Request failed with status code 501') {
      dispatch(balanceTooLow());
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
    default:
      return state;
  }
}
