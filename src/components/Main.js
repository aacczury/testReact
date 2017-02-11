import React, { Component } from 'react';
import {ActionHome} from 'material-ui/svg-icons';

//import Header from './Header';
//import UserInfo from './UserInfo';
//import Register from './Register';


class Main extends Component {
  render() {
    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          <h1>正興城灣盃報名系統</h1>
          <h2>請先登入</h2>
        </div>
      </div>
    );

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default Main;
