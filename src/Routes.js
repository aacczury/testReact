import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import App from './pages/App';
//import NotFound from './components/NotFound';

class Routes extends Component {
  render() {
    return(
      <Router {...this.props} basename={this.props.basename}>
        <Route path="/" component={App} />
        {/*<Route path="*" component={NotFound} />*/}
      </Router>
    )
  }
}

export default Routes;
