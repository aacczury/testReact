import React from 'react';
import ReactDOM from 'react-dom';

import Routes from './Routes';

import './index.css';

const Index = () => (
  <Routes basename="/" />
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
