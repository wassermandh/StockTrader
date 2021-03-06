import React, { Component } from 'react';
import { gettingPortfolio } from '../store';
import StockPurchaseForm from './stock_purchase_form';
import { connect } from 'react-redux';
import axios from 'axios';

class Porfolio extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getPortfolio();
  }
  render() {
    return (
      <div className="portfolioComponentContainer">
        <div id="portfolioContainer">
          <h1 className="sectionHeader">
            Portfolio (${this.props.portfolioTotal})
          </h1>
          {Object.keys(this.props.portfolio).length > 0
            ? Object.keys(this.props.portfolio).map(stock => {
                return (
                  <div
                    className={`portfolioStock ${
                      this.props.portfolio[stock].performance
                    }`}
                    key={stock}
                  >
                    <span>
                      <strong>
                        {stock} - {this.props.portfolio[stock].quantity} shares
                      </strong>
                    </span>
                    <span>
                      Worth ${this.props.portfolio[stock].quantity *
                        this.props.portfolio[stock].latestPrice}
                    </span>
                  </div>
                );
              })
            : ''}
          {this.props.grabbingPortfolio ? <h3>Loading...</h3> : ''}
          {this.props.portfolioThrottle.length ? (
            <h3 id="throttlingError">ERROR: {this.props.portfolioThrottle}</h3>
          ) : (
            ''
          )}
        </div>
        <span id="portfolioVerticalLine" />
        <div id="stockPurchaseForm">
          <h3 id="balanceHeader">
            Balance Remaining - ${this.props.user.balance}
          </h3>
          <StockPurchaseForm />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    portfolio: state.stock.portfolio.stocks,
    portfolioTotal: state.stock.portfolio.totalCost,
    portfolioThrottle: state.stock.portfolioThrottle,
    grabbingPortfolio: state.stock.grabbingPortfolio,
    stocks: state.stock.stocks,
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
