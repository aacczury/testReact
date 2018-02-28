import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Header from './Header.js';
import InputContainer from './InputContainer.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputData: [
        { type: "text", name: "name", text: "暱稱" },
        { type: "text", name: "password", text: "密碼" },
        { type: "email", name: "email", text: "電子信箱" }
      ],
      pageState: "main"
    };
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    var self = this;
    window.firebase.auth().onAuthStateChanged(function (user) {
      self.setState({ // need loading
        isUserLogin: user
      });
    });
  }

  componentDidUpdate() {
    console.log(this.state.pageState);
    if (this.state.pageState === "login") {
      var uiConfig = {
        'callbacks': {
          'signInSuccess': function (user, credential, redirectUrl) {
            //if(!user.emailVerified){
            //  user.sendEmailVerification().then(function(){
            //    dialog.showModal();
            //  });
            //  return false;
            //}else return true;
          }
        },
        'signInOptions': [
          window.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          window.firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        'tosUrl': 'https://www.google.com/policies/terms/'
      };

      var ui = new window.firebaseui.auth.AuthUI(window.firebase.auth());
      console.log(document.querySelector("#firebaseui-auth-container"));
      ui.start('#firebaseui-auth-container', uiConfig);
    }
  }

  handleAddClick() {
    this.setState(prevState => {
      return { inputData: prevState.inputData.concat({ type: "text", name: "TEST", text: "TEST" }) };
    });
  }

  handleHeaderClick(buttonState) {
    return {
      login: (e) => {
        this.setState(prevState => {
          return { pageState: "login" };
        });
      },
      logout: (e) => {
        var self = this;
        window.firebase.auth().signOut().then(function () {
          self.setState(prevState => {
            return { pageState: "main" };
          });
        });
      }
    }[buttonState];
  }

  render() {
    console.log(this.state.isUserLogin);

    var headerTitle = {
      main: "正興城灣盃",
      login: "登入"
    }
    var header = <Header title={!(this.state.pageState in headerTitle) ? headerTitle.main : headerTitle[this.state.pageState]}
      isUserLogin={this.state.isUserLogin} headerClick={this.handleHeaderClick} />;

    var pageDom = {
      main: (
        <div className="mdl-layout__content" style={{ marginTop: "50px" }}>
          <InputContainer inputData={this.state.inputData} />
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.handleAddClick}>
            Add
          </button>
        </div>
      ),
      login: (
        <div className="mdl-layout__content" style={{ marginTop: "50px" }}>
          <div id="firebaseui-auth-container"></div>
        </div>
      )
    };
    let page = null;
    if (!(this.state.pageState in pageDom)) {
      page = pageDom.main;
    }
    else {
      page = pageDom[this.state.pageState];
    }

    return (
      <div className="App">
        {header}
        {page}
        {/*<div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>*/}
      </div>
    );
  }
}

export default App;