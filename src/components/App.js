import React, { Component } from 'react';

import Header from './Header.js';
import InputContainer from '../containers/InputContainer.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputData: [
        { type: "text", name: "name", text: "暱稱" },
        { type: "text", name: "password", text: "密碼" },
        { type: "email", name: "email", text: "電子信箱"}
      ]
    };
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    var self = this;
    window.firebase.auth().onAuthStateChanged(function(user) {
      self.setState({ // need loading
        user: user,
        inputData: [
          { type: "email", name: "email", text: "電子信箱", value: user.email },
          { type: "text", name: "username", text: "顯示名稱", value: user.displayName },
        ]
      });
    });
  }

  componentDidUpdate(){
    console.log("Update!!");
  }

  handleAddClick() {
    this.setState(prevState => {
      return {inputData: prevState.inputData.concat({type: "text", name: "TEST", text: "TEST"})};
    });
  }

  handleButtonClick(event) {
    return {
    logout: () => {
      window.firebase.auth().signOut().then(function(){
        console.log("Logout safe."); // need a dialog
      });
    },
    login: () => {
      window.location = "/login";
    }
    }[event]
  }

  render() {
    console.log(this.state.user);
    var header = this.state.user ?
      <Header title="正興城灣盃" buttonTitle="Logout" isUserLogin={this.state.user} buttonClick={this.handleButtonClick("logout")}  /> :
      <Header title="正興城灣盃" buttonTitle="Login" isUserLogin={this.state.user} buttonClick={this.handleButtonClick("login")}  />;

    let page = null;
    if(this.state.user) {
      page = (
        <main className="mdl-layout__content" style={{marginTop: "50px"}}>
          <InputContainer inputData={this.state.inputData} addClick={this.handleAddClick} />
        </main>
      );
    }
    else {
      page = (
        <main className="mdl-layout__content" style={{marginTop: "50px"}}>
          <div className="mdl-typography--text-center">
            <div className="mdl-typography--display-3">正興城灣盃報名系統</div>
            <div className="mdl-typography--display-2">請先登入</div>
          </div>
        </main>
      );
    }

    return (
      <div className="App mdl-layout mdl-js-layout">
        {header}
        {page}
      </div>
    );
  }
}

export default App;
