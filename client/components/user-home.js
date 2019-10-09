import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//component
export const UserHome = props => {
  const { name } = props;

  return (
    <div>
      <div>
        <h3>Welcome, {name}!</h3>
      </div>
    </div>
  );
};

//container
const mapState = state => {
  return {
    name: state.user.name,
  };
};

export default connect(mapState)(UserHome);

//prop types
UserHome.propTypes = {
  name: PropTypes.string,
};
