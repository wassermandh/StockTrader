import React, { Component } from 'react';
import { buyingStock, gettingPortfolio } from '../store';
import { connect } from 'react-redux';

class StockPurchaseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
      quantity: '',
      error: this.props.error,
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
      <div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <input
                className="stockPurchaseInput"
                placeholder="stock ticker"
                type="text"
                name="ticker"
                onChange={this.handleChange}
                required
              />
            </div>
            <div>
              <input
                className="stockPurchaseInput"
                placeholder="quantity"
                type="number"
                name="quantity"
                min="0"
                onChange={this.handleChange}
                required
              />
            </div>
            <input id="stockSubmit" type="submit" value="Submit" />
          </form>
        </div>
        <div>{this.props.error.length ? <p>{this.props.error}</p> : ''}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    error: state.stock.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    buyStock: (ticker, quantity) => {
      dispatch(buyingStock(ticker, quantity));
    },
    getPortfolio: () => {
      dispatch(gettingPortfolio());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockPurchaseForm);
