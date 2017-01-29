import React, { Component } from 'react';

import Header from './Header';
import UserInfo from './UserInfo';
import Register from './Register';

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
      user: null
    };

    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleHeaderButtonClick = this.handleHeaderButtonClick.bind(this);

    var self = this;
    window.firebase.auth().onAuthStateChanged(function(user) {
      self.setState({ // need loading
        user: user
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

  handleHeaderButtonClick(event) {
    return {
    logout: () => {
      window.firebase.auth().signOut().then(function(){
        console.log("Logout safe."); // need a dialog
      });
    },
    login: () => {
      this.context.router.push('/login');
      //window.location = '/testReact/login';
    }
    }[event]
  }

  render() {
    //console.log(this.state.user);
    var header = this.state.user ?
      <Header title="正興城灣盃" buttonTitle="Logout" isUserLogin={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("logout")}  /> :
      <Header title="正興城灣盃" buttonTitle="Login" isUserLogin={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("login")}  />;

    let page = null;
    if(this.props.params.th && this.state.user){
      page = <Register th={this.props.params.th} user={this.state.user} />
    }
    else if(this.state.user) {
      page = <UserInfo user={this.state.user} />;
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
    console.log(page);
    return (
      <div className="App mdl-layout mdl-js-layout">
        {header}
        {page}
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default App;
