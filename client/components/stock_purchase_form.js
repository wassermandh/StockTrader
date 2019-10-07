import React, { Component } from 'react';

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
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Stonk Ticker:
          <input type="text" name="ticker" />
        </label>
        <label>
          Quantity
          <input type="number" name="ticker" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default StockPurchaseForm;
