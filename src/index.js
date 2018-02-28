import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { createStore } from 'redux'

import { FIREBASE_CONFIG_BAK, BASE_NAME_BAK } from './constants/tokens';
import Routes from './Routes';
import registrationApp from './reducers';

import './index.css';

injectTapEventPlugin();

let store = createStore(registrationApp);
const browserHistory = useRouterHistory(createHistory)({ basename: BASE_NAME_BAK });

const Index = () => (
  <MuiThemeProvider>
    <Provider store={store}>
      <Routes history={browserHistory} />
    </Provider>
  </MuiThemeProvider>
)

// Initialize Firebase
window.firebase.initializeApp(FIREBASE_CONFIG_BAK);

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);