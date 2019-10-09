import React, { Component } from 'react';
import { gettingTransactions } from '../store';
import { connect } from 'react-redux';
import axios from 'axios';

class Transactions extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getTransactions();
  }

  render() {
    return (
      <div className="transactionContainer">
        <div>
          <h1 className="sectionHeader">Transactions</h1>
        </div>
        <div className="transactionItemContainer">
          {this.props.stocks.map(stock => {
            return (
              <div className="transactionItem" key={stock.id}>
                <strong>
                  BUY ({stock.ticker}) - {stock.quantity} shares @ ${
                    stock.priceAtPurchase
                  }{' '}
                  each
                </strong>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTransactions: () => {
      dispatch(gettingTransactions());
    },
  };
};

const mapStateToProps = state => {
  return {
    stocks: state.stock.stocks,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
