import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import App from './pages/App';

class Routes extends Component {
  render() {
    return(
      <Router {...this.props} basename={this.props.basename}>
        <Route path="/" component={App} />
      </Router>
    )
  }
}

export default Routes;
