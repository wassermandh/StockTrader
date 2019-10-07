import React, { Component } from 'react';
import StockPurchaseForm from './stock_purchase_form';
import { connect } from 'react-redux';

const Porfolio = props => {
  return (
    <div>
      <StockPurchaseForm />
    </div>
  );
};

export default connect(null, null)(Porfolio);
