import React, { Component } from 'react';
import { Router, Route } from 'react-router';

import App from './components/App';
//import NotFound from './components/NotFound';

class Routes extends Component {
  render() {
    return(
      <Router history={this.props.history}>
        <Route path="/" component={App} store={this.props.store} />
        <Route path="/login" component={App} store={this.props.store} />
        <Route path="/th/:th" component={App} store={this.props.store} />
        {/*<Route path="*" component={NotFound} />*/}
      </Router>
    )
  }
}

export default Routes;
