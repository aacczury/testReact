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
      if(user && self.props.location.query.login)
        self.handleRedirect('/');
      // need loading icon
      if(user)
        window.firebase.database().ref(`/users/${user.uid}`).once('value').then(snapshot => {
          console.log("get user");
          let userInfo = snapshot.val() ? snapshot.val() : {};
          Object.defineProperty(user, "auth", {
            value: userInfo.auth,
            writable: false,
            enumerable: false,
            configurable: false
          });
          self.setState({user: user});
        });
      else self.setState({user: user});
    });
  }

  componentDidUpdate = () => {
    console.log("App Update!!");
  }

  handleRedirect = url => {
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

    console.log(this.state.user);
    let header = null;
    let content = null;
    let query = this.props.location.query;
    if(this.state.user) {
      let university = null;
      if(this.state.user.auth !== "admin"){
        let universityName = ["ncku", "ccu", "nsysu", "nchu"];
        if(universityName.indexOf(this.state.user.auth) < 0) {
          console.log("Error university"); // need handle
        }
        else if(query.university && this.state.user.auth !== query.university){
          console.log("Not your university");
        }
        else
          university = this.state.user.auth;
      } else {
        university = query.university ? query.university : "ncku";
      }

      if(query.th) {
        if(query.overview && this.state.user.auth === "admin") {
          header = <Header title={`正興城灣盃-第${query.th}屆總覽`} user={this.state.user}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Overview user={this.state.user} th={query.th} />
        }
        else if(query.sport && university) {
          header = <Header title={`正興城灣盃-第${query.th}屆報名資料`} user={this.state.user}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Participants user={this.state.user} th={query.th} sport={query.sport} university={university} />
        }
        else if(!query.sport){
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} user={this.state.user}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Sports user={this.state.user} handleRedirect={this.handleRedirect} th={query.th} />
        }
        else {
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} />
          content = <div>有些出錯</div>
        }
      }
      else {
        header = <Header title="正興城灣盃-歷屆資料" user={this.state.user}
          handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} />
        content = <Years user={this.state.user} handleRedirect={this.handleRedirect} />;
      }
    }
    else if(query.login) {
      header = <Header login={query.login} title="正興城灣盃-登入" />
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
