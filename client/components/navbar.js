import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

const Navbar = ({ handleClick, isLoggedIn, name }) => (
  <div>
    <div id="welcomeNav">
      <h1>Welcome to your stock trading app, {name}!</h1>
    </div>
    <nav>
      {isLoggedIn ? (
        <div id="signedInNav">
          <a className="navItem" href="#" onClick={handleClick}>
            Logout
          </a>
          <span className="verticalLine" />
          <span>
            <Link className="navItem" to="/portfolio">
              Portfolio
            </Link>
            <span className="verticalLine" />
            <Link className="navItem" to="/transactions">
              Transactions
            </Link>
          </span>
        </div>
      ) : (
        <div id="signedOutNav">
          <Link className="navItem" to="/login">
            Login
          </Link>
          <span className="verticalLine" />
          <Link className="navItem" to="/signup">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  </div>
);

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    name: state.user.name,
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);

//prop types
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
