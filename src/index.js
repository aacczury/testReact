import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { FIREBASE_CONFIG_BAK } from './constants/tokens';
import Routes from './Routes';

import './index.css';

injectTapEventPlugin();

const browserHistory = useRouterHistory(createHistory)({ basename: "/act/chcwcup/register/" });

const Index = () => (
  <MuiThemeProvider>
    <Routes history={browserHistory} />
  </MuiThemeProvider>
)

// Initialize Firebase
window.firebase.initializeApp(FIREBASE_CONFIG_BAK);

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
