import axios from 'axios';
import history from '../history';

const BUY_STOCK = 'BUY_STOCK';
const INCORRECT_TICKER = 'INCORRECT_TICKER';

const defaultStocks = { stocks: [], error: '' };

//action creators
const buyStock = (stock, quantity) => {
  quantity = Number(quantity);
  return {
    type: BUY_STOCK,
    stock,
    quantity,
  };
};

const incorrectTicker = () => {
  return {
    type: INCORRECT_TICKER,
  };
};

//thunks
export const buyingStock = (stock, quantity) => async dispatch => {
  try {
    const { data } = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock}&apikey=O1X1GO5YCEATSYLF`
    );
    if (data['Error Message']) {
      dispatch(incorrectTicker());
    } else {
      console.log('hiIIII');
      const createdStock = await axios.post('/api/stocks/', { data, quantity });
      dispatch(buyStock(stock, quantity));
    }
  } catch (err) {
    console.error(err);
  }
};

//reducer
export default function(state = defaultStocks, action) {
  switch (action.type) {
    case BUY_STOCK:
      return {
        stocks: [
          ...state.stocks,
          { stock: action.stock, quantity: action.quantity },
        ],
        error: '',
      };
    case INCORRECT_TICKER:
      return { ...state, error: 'Ticket is incorrect' };
    default:
      return state;
  }
}
