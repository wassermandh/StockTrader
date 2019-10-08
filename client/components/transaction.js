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
      <div>
        <div>
          <h1>Transactions</h1>
        </div>
        <div>
          {this.props.stocks.map(stock => {
            return (
              <div key={stock.id}>
                <strong>
                  BUY ({stock.ticker}) - {stock.quantity} shares @ ${
                    stock.priceAtPurchase
                  }
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
