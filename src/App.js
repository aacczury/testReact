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
        { type: "email", name: "email", text: "電子信箱"}
      ]
    };
    this.handleAddClick = this.handleAddClick.bind(this);
    var self = this;
    window.firebase.auth().onAuthStateChanged(function(user) {
      self.setState({ // need loading
        isUserLogin: user
      });
    });
  }

  componentDidMount() {
  }

  handleAddClick() {
    this.setState(prevState => {
      return {inputData: prevState.inputData.concat({type: "text", name: "TEST", text: "TEST"})};
    });
  }

  render() {
    console.log(this.state.isUserLogin);
    const firebaseuiAuthContainerStyle = {
      margin: "50px auto"
    }

    return (
      <div className="App">
        <Header title="登入" isUserLogin={this.state.isUserLogin}/>
        <div className="mdl-layout__content">
          <div id="firebaseui-auth-container" style={firebaseuiAuthContainerStyle}></div>
        </div>
        {/*<div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>*/}
        <InputContainer inputData={this.state.inputData}/>
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.handleAddClick}>
          Add
        </button>
      </div>
    );
  }
}

export default App;
