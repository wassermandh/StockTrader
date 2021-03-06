import axios from 'axios';
import history from '../history';

const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';
const UPDATE_BALANCE = 'UPDATE_BALANCE';
const CLEAR_ERROR = 'CLEAR_ERROR';

const defaultUser = {};

//action creators
const getUser = user => ({ type: GET_USER, user });
const removeUser = () => ({ type: REMOVE_USER });
export const updateBalance = totalCost => {
  return {
    type: UPDATE_BALANCE,
    totalCost,
  };
};
export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};

//thunks

export const me = () => async dispatch => {
  try {
    const res = await axios.get('api/auth/me');
    dispatch(getUser(res.data || defaultUser));
  } catch (err) {
    console.error(err);
  }
};

export const auth = (name, email, password, method) => async dispatch => {
  let res;
  try {
    res = await axios.post(`api/auth/${method}`, { name, email, password });
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }

  try {
    dispatch(getUser(res.data));
    history.push('/portfolio');
  } catch (error) {
    console.error(error);
  }
};

export const logout = () => async dispatch => {
  try {
    await axios.post('api/auth/logout');
    dispatch(removeUser());
    history.push('/login');
  } catch (err) {
    console.error(err);
  }
};

//reducer
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    case CLEAR_ERROR:
      return { ...state, error: '' };
    case UPDATE_BALANCE:
      let newBalance = state.balance - action.totalCost;
      return { ...state, balance: newBalance };
    default:
      return state;
  }
}
