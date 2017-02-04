import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import FontIcon from 'material-ui/FontIcon';

//import Header from './Header';
//import UserInfo from './UserInfo';
//import Register from './Register';


class Main extends Component {
  render() {
    let header = (
      <AppBar
        title="正興城灣盃"
        iconClassNameRight="icon-expand-more"
      />
    );

    let page = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
           <FontIcon
             className="icon-home"
           />
          <h1>正興城灣盃報名系統</h1>
          <h2>請先登入</h2>
        </div>
      </div>
    );

    return (
      <div>
        {header}
        {page}
      </div>
    );
  }
}

export default Main;
