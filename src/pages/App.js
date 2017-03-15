import React, { Component } from 'react';

import Header from '../partials/Header';
import Main from './Main';
import Login from './Login';
import Years from './Years';
import Sports from './Sports';
import Participants from './Participants'
import Overview from './Overview'

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
        this.handleRedirect('/?login=true');
      }
    }[event]
  }

  render() {
    let header = null;
    let content = null;
    let query = this.props.location.query;
    console.log(query);
    if(this.state.user) {
      if(query.th) {
        if(query.overview) {
          header = <Header title={`正興城灣盃-第${query.th}屆總覽`} user={this.state.user}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Overview user={this.state.user} th={query.th} />
        }
        else if(query.sport) {
          header = <Header title={`正興城灣盃-第${query.th}屆報名資料`} user={this.state.user}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Participants user={this.state.user} th={query.th} sport={query.sport} />
        }
        else {
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} user={this.state.user}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Sports user={this.state.user} handleRedirect={this.handleRedirect} th={query.th} />
        }
      }
      else {
        header = <Header title="正興城灣盃-歷屆資料" user={this.state.user}
          handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} />
        content = <Years user={this.state.user} handleRedirect={this.handleRedirect} />;
      }
    }
    else if(query.login || query.mode) {
      header = <Header login={query.login || query.mode} title="正興城灣盃-登入" />
      content = <Login handleRedirect={this.handleRedirect} />
    }
    else {
      header = <Header title="正興城灣盃"
        handleHeaderButtonClick={this.handleHeaderButtonClick("login")} />
      content = <Main />;
    }

    return (
      <div className="App">
        {header}
        {content}
      </div>
    );
  }
}

export default App;
