import React, { Component } from 'react';
import { buyingStock } from '../store';
import { connect } from 'react-redux';

class StockPurchaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      quantity: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.buyStock(this.state.ticker, this.state.quantity);
  }

  render() {
    console.log(this.state);
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Stonk Ticker:
          <input
            type="text"
            name="ticker"
            onChange={this.handleChange}
            required
          />
        </label>
        <label>
          Quantity
          <input
            type="number"
            name="quantity"
            min="0"
            onChange={this.handleChange}
            required
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    buyStock: (ticker, quantity) => {
      dispatch(buyingStock(ticker, quantity));
    },
  };
};

export default connect(null, mapDispatchToProps)(StockPurchaseForm);
