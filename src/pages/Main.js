import React, { Component } from 'react';

import logo from '../assets/logo.png';

class Main extends Component {
  render() {
    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <img src={logo} alt='logo' style={{width: '200px'}} /><br />
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
