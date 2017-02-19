import React, { Component } from 'react';

import Header from './Header';
import Main from './Main';
import Login from './Login';
import Years from './Years';
import Sports from './Sports';
import Participants from './Participants'

//import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    console.log("app construct");

    this.state = {
      user: null,
    };
  }

  componentDidMount(){
    console.log("app did mount");
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

    if(this.state.user) {
      if(this.props.params.th) {
        if(this.props.params.sport) {
          header = <Header route={this.props.route} title={`正興城灣盃-第${this.props.params.th}屆報名資料`} user={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={this.props.params.th} />
          content = <Participants user={this.state.user} th={this.props.params.th} sport={this.props.params.sport} />
        }
        else {
          header = <Header route={this.props.route} title={`正興城灣盃-第${this.props.params.th}屆報名資料`} user={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={this.props.params.th} />
          content = <Sports user={this.state.user} router={this.props.router} th={this.props.params.th} />
        }
      }
      else {
        header = <Header route={this.props.route} title="正興城灣盃-歷屆資料" user={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} />
        content = <Years user={this.state.user} router={this.props.router} />;
      }
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
