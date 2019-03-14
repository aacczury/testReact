import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Routes from './Routes';

import './index.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#b71c1c'
    },
    secondary: {
      main: '#039be5',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const Index = () => (
  <MuiThemeProvider theme={theme}>
    <Routes basename="/" />
  </MuiThemeProvider>
)

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4ox0dHobP_lh93NKepmTm-djJzLTJmKA",
  authDomain: "chcwcup-bak.firebaseapp.com",
  databaseURL: "https://chcwcup-bak.firebaseio.com",
};
window.firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
