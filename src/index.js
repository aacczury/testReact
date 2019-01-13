import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './Routes';

import './index.css';

const Index = () => (
  <Routes basename="/act/chcwcup/register/" />
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
