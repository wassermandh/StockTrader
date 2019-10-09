import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { auth } from '../store';

//component
const AuthForm = props => {
  let { name, displayName, handleSubmit, error } = props;
  return (
    <div id="authFormContainer">
      <h3 id="loginHeader">{name[0].toUpperCase() + name.slice(1)}</h3>
      <form onSubmit={handleSubmit} name={name}>
        {name === 'signup' ? (
          <div className="formElement">
            <label htmlFor="name" />
            <input name="userName" type="text" placeholder="name" required />
          </div>
        ) : (
          ''
        )}
        <div className="formElement">
          <label htmlFor="email" />
          <input name="email" type="text" required placeholder="email" />
        </div>
        <div className="formElement">
          <label htmlFor="password" />
          <input
            name="password"
            type="password"
            placeholder="password"
            required
          />
        </div>
        <div id="loginButton">
          <button type="submit">{displayName}</button>
        </div>
        {error &&
          error.response && <div id="error"> {error.response.data} </div>}
      </form>
    </div>
  );
};

const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
  };
};

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
  };
};

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      let name = formName === 'signup' ? evt.target.userName.value : '';
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      dispatch(auth(name, email, password, formName));
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

//prop types
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
};
