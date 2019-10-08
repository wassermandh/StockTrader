import React, { Component } from 'react';
import { gettingPortfolio } from '../store';
import StockPurchaseForm from './stock_purchase_form';
import { connect } from 'react-redux';
import axios from 'axios';

class Porfolio extends Component {
  constructor(props) {
    super(props);
    // this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    if (Object.keys(this.props.portfolio).length === 0) {
      console.log('hi');
      this.props.getPortfolio();
    }
  }
  render() {
    return (
      <div>
        {/* <button type="button" onClick={this.handleClick}>
          Click to load updated portfolio
        </button> */}
        <div>
          <h1>Portfolio</h1>
          {Object.keys(this.props.portfolio).length > 0
            ? Object.keys(this.props.portfolio).map(stock => {
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
              })
            : ''}
          {this.props.grabbingPortfolio ? <h3>Loading...</h3> : ''}
          {this.props.loadingMoreStocks.length ? (
            <h3>{this.props.loadingMoreStocks}</h3>
          ) : (
            ''
          )}
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
    loadingMoreStocks: state.stock.loadingMoreStocks,
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
