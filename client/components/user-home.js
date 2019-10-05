import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//component
export const UserHome = props => {
  const { email } = props;

  return (
    <div>
      <h3>Welcome, {email}</h3>
    </div>
  );
};

//container
const mapState = state => {
  return {
    email: state.user.email,
  };
};

export default connect(mapState)(UserHome);

//prop types
UserHome.propTypes = {
  email: PropTypes.string,
};
