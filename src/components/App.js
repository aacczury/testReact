import React, { Component } from 'react';

import Header from './Header';
import Main from './Main';
import Login from './Login';
import UserInfo from './UserInfo';
import Register from './Register';

//import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    console.log("app construct");

    this.state = {
      user: null,
      userReg: {},
      userInfo: {}
    };

    var self = this;
    window.firebase.auth().onAuthStateChanged(function(user) {
      // need loading icon
      self.setState({
        user: user
      });
    });
  }

  componentDidUpdate(){
    console.log("App Update!!");
  }

  handleRedirect = url => {
    console.log(url);
    this.props.router.push(url);
  }

  handleHeaderButtonClick = event => {
    return {
      logout: () => {
        let self = this;
        window.firebase.auth().signOut().then(function(){
          console.log("Logout safe."); // need a dialog
          self.handleRedirect('/');
        });
      },
      login: () => {
        this.handleRedirect('/login');
      }
    }[event]
  }

  render() {
    let header = null;
    let content = null;

    if(this.props.route.path === '/th/:th' && this.props.params.th && this.state.user) {
      header = <Header route={this.props.route} title={`正興城灣盃-第${this.props.params.th}屆報名資料`} user={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={this.props.params.th} />
      content = <Register user={this.state.user} th={this.props.params.th} />
    }
    else if(this.state.user) {
      header = <Header route={this.props.route} title="正興城灣盃-個人資料" user={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} />
      content = <UserInfo user={this.state.user} />;
    }
    else if(this.props.route.path === '/login') {
      header = <Header route={this.props.route} title="正興城灣盃-登入" />
      content = <Login route={this.props.route} router={this.context.router} />
    }
    else {
      header = <Header route={this.props.route} title="正興城灣盃" handleHeaderButtonClick={this.handleHeaderButtonClick("login")} />
      content = <Main route={this.props.route} />;
    }

    return (
      <div className="App">
        {header}
        {content}
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default App;
