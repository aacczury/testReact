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
      ],
      userInfo: {},
      user: null
    };

    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleHeaderButtonClick = this.handleHeaderButtonClick.bind(this);
    this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
    this.handleInfoUpdateClick = this.handleInfoUpdateClick.bind(this);

    var self = this;
    window.firebase.auth().onAuthStateChanged(function(user) {
      if(user) {
        let userId = user.uid;
        window.firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
          let userValue = snapshot.val() ? snapshot.val() : {};
          //console.log(userValue);
          let userInfo = {
            email: user.email,
            displayName: userValue.displayName ? userValue.displayName : user.displayName
          }

          self.setState({ // need loading
            user: user,
            inputData: [
              { type: "email", name: "email", text: "電子信箱", value: userInfo.email, disabled: true },
              { type: "text", name: "displayName", text: "顯示名稱", value: userInfo.displayName, disabled: false },
            ],
            userInfo: {
              displayName: userInfo.displayName
            }
          });
        });
      }
      else {
        self.setState({ // need loading
          user: user
        });
      }
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

  handleInfoUpdate(d){
    this.setState(prevState => {
      return {userInfo: Object.assign(prevState.userInfo, d)};
    })
  }

  handleInfoUpdateClick() {
    //console.log(this.state);
    /*this.setState(prevState => {

    });*/
    if(this.state.user) {
      let userId = this.state.user.uid;
      window.firebase.database().ref('/users/' + userId).update({
        displayName: this.state.userInfo.displayName
      });
    }
  }

  handleHeaderButtonClick(event) {
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
    //console.log(this.state.user);
    var header = this.state.user ?
      <Header title="正興城灣盃" buttonTitle="Logout" isUserLogin={this.state.user} buttonClick={this.handleHeaderButtonClick("logout")}  /> :
      <Header title="正興城灣盃" buttonTitle="Login" isUserLogin={this.state.user} buttonClick={this.handleHeaderButtonClick("login")}  />;

    let page = null;
    if(this.state.user) {
      page = (
        <main className="mdl-layout__content" style={{marginTop: "50px"}}>
          <div className="mdl-typography--text-center">
            <InputContainer inputData={this.state.inputData} handleInfoUpdate={this.handleInfoUpdate} />
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
              onClick={this.handleInfoUpdateClick}>
              更新
            </button>
          </div>
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
