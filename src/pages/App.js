import React, { Component } from 'react';

import LoadDialog from '../components/LoadDialog';
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

    this.state = {
      user: null,
      loadDialogOpen: true
    };
  }

  componentDidMount(){
    var self = this;
    window.firebase.auth().onAuthStateChanged(function(user) {
      if(user && self.props.location.query.login)
        self.handleRedirect('/');
      // need loading icon
      if(user)
        window.firebase.database().ref(`/users/${user.uid}`).once('value').then(snapshot => {
          let userInfo = snapshot.val() ? snapshot.val() : {};
          Object.defineProperty(user, "auth", {
            value: userInfo.auth,
            writable: false,
            enumerable: false,
            configurable: false
          });
          self.setState({
            user: user,
            loadDialogOpen: false
          });
        });
      else self.setState({
        user: user,
        loadDialogOpen: false
      });
    });
  }

  componentWillReceiveProps = (nextProps) => {
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

  handleLoadDialogOpen = () => {
    this.setState({loadDialogOpen: true});
  }

  handleLoadDialogClose = () => {
    this.setState({loadDialogOpen: false});
  }

  render() {
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
          content = <Participants user={this.state.user} th={query.th} sport={query.sport} university={university} handleRedirect={this.handleRedirect} />
        }
        else if(!query.sport){
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} user={this.state.user}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Sports user={this.state.user} handleRedirect={this.handleRedirect} th={query.th} />
        }
        else {
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} />
          content = <h1>有些出錯</h1>
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
      content = <Login handleRedirect={this.handleRedirect}
                  handleLoadDialogOpen={this.handleLoadDialogOpen} handleLoadDialogClose={this.handleLoadDialogClose} />
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
        <LoadDialog loadDialogOpen={this.state.loadDialogOpen} />
      </div>
    );
  }
}

export default App;
