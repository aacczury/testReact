import React, { Component } from 'react';
import { Router, Route } from 'react-router';

import App from './pages/App';
//import NotFound from './components/NotFound';

class Routes extends Component {
  render() {
    return(
      <Router {...this.props}>
        <Route path="/" component={App} />
        {/*<Route path="*" component={NotFound} />*/}
      </Router>
    )
  }
}

export default Routes;
