import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import merge from 'deepmerge';

import Routes from './Routes';

import './index.css';

injectTapEventPlugin();

const browserHistory = useRouterHistory(createHistory)({ basename: "/" })

let store = {};
let updateStore = (data) => {
  store = merge(store, data);
}

const Index = () => (
  <MuiThemeProvider>
    <Routes history={browserHistory} store={store} updateStore={updateStore} />
  </MuiThemeProvider>
)

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
