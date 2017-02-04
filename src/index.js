import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Routes from './Routes';

import './icon.css';
import './index.css';

injectTapEventPlugin();

const browserHistory = useRouterHistory(createHistory)({ basename: "/" })

ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
);
