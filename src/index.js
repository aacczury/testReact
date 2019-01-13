import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Routes from './Routes';

import './index.css';

injectTapEventPlugin();

const Index = () => (
  <MuiThemeProvider>
    <Routes basename="/act/chcwcup/register/" />
  </MuiThemeProvider>
)

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAjdarRIsUshhdQOwaFLxlBneFWz12JrTU",
  authDomain: "chcwcup.firebaseapp.com",
  databaseURL: "https://chcwcup.firebaseio.com",
};
window.firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
