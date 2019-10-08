import React, { Component } from 'react';
import { gettingPortfolio } from '../store';
import StockPurchaseForm from './stock_purchase_form';
import { connect } from 'react-redux';
import axios from 'axios';

class Porfolio extends Component {
  componentDidMount() {
    this.props.getPortfolio();
  }
  render() {
    return (
      <div>
        <div>
          <h1>Portfolio</h1>
          {Object.keys(this.props.portfolio).map(stock => {
            return (
              <div key={stock}>
                <strong>
                  {stock} - {this.props.portfolio[stock].quantity}
                </strong>
                <span>
                  {this.props.portfolio[stock].quantity *
                    this.props.portfolio[stock].latestPrice}
                </span>
              </div>
            );
          })}
        </div>
        <div>
          <h1>Cash - {this.props.user.balance}</h1>
          <StockPurchaseForm />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    portfolio: state.stock.portfolio,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPortfolio: () => {
      dispatch(gettingPortfolio());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Porfolio);
