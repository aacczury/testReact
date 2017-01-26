import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import Routes from './Routes';

import './index.css';

const browserHistory = useRouterHistory(createHistory)({ basename: "/testReact" })

ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);
