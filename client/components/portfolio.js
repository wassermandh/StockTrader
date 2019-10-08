import React, { Component } from 'react';
import StockPurchaseForm from './stock_purchase_form';
import { connect } from 'react-redux';

class Porfolio extends Component {
  render() {
    return (
      <div>
        <h1>Cash - {this.props.user.balance}</h1>
        <StockPurchaseForm />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, null)(Porfolio);
