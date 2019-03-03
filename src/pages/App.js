import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import queryString from 'query-string';

import LoadDialog from '../components/LoadDialog';
import Header from '../partials/Header';
import LeftMenu from '../partials/LeftMenu';
import Main from './Main';
import Login from './Login';
import Years from './Years';
import Sports from './Sports';
import Participants from './Participants'
import Overview from './Overview'

import { UNIVERSITY_LIST } from '../config';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loadDialogOpen: true,
      menuOpen: false,
    };
  }

  componentDidMount(){
    const self = this;
    const query = queryString.parse(this.props.location.search);

    window.firebase.auth().onAuthStateChanged(user => {
      if (user && query.login) {
        self.handleRedirect('/');
      }

      if (user) {
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
      } else {
        self.setState({
          user: user,
          loadDialogOpen: false
        });
      }
    });
  }

  handleRedirect = url => {
    this.props.history.push(url);
  }

  handleHeaderButtonClick = event => {
    return {
      logout: () => {
        let self = this;
        window.firebase.auth().signOut().then(function(){
          self.handleRedirect('/');
        });
      },
      login: () => {
        this.handleRedirect('/?login=true');
      }
    }[event]
  }

  handleMenuOpen = () => this.setState({menuOpen: true});
  handleMenuClose = () => this.setState({menuOpen: false});

  handleLoadDialogOpen = () => this.setState({loadDialogOpen: true});
  handleLoadDialogClose = () => this.setState({loadDialogOpen: false});

  render() {
    const query = queryString.parse(this.props.location.search);
    let header = null;
    let content = null;

    if(this.state.user) {
      let university = null;
      if(this.state.user.auth === "admin" || this.state.user.auth === "overview"){
        university = query.university ? query.university : "ncku";
      } else {
        if (0 > UNIVERSITY_LIST.indexOf(this.state.user.auth)) {
          console.log("Error university"); // need handle
        }
        else if(query.university && this.state.user.auth !== query.university){
          console.log("Not your university");
        }
        else
          university = this.state.user.auth;
      }

      if(query.th) {
        if (query.overview && query.university && (this.state.user.auth === "admin" || this.state.user.auth === "overview")) {
          header = <Header title={`正興城灣盃-第${query.th}屆總覽-${query.university.toUpperCase()}`} user={this.state.user} handleMenuOpen={this.handleMenuOpen}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} th={query.th} />
          content = <Overview user={this.state.user} university={university} th={query.th} />
        }
        else if(query.sport && university) {
          header = <Header title={`正興城灣盃-第${query.th}屆報名資料`} user={this.state.user} handleMenuOpen={this.handleMenuOpen}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} th={query.th} />
          content = <Participants user={this.state.user} th={query.th} sport={query.sport} university={university} handleRedirect={this.handleRedirect} />
        }
        else if(!query.sport){
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} user={this.state.user} handleMenuOpen={this.handleMenuOpen}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} th={query.th} />
          content = <Sports user={this.state.user} handleRedirect={this.handleRedirect} th={query.th} />
        }
        else {
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} />
          content = <h1>有些出錯</h1>
        }
      }
      else {
        header = <Header title="正興城灣盃-歷屆資料" user={this.state.user} handleMenuOpen={this.handleMenuOpen}
          handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} />
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
        <LeftMenu user={this.state.user} menuOpen={this.state.menuOpen} handleMenuClose={this.handleMenuClose} handleRedirect={this.handleRedirect} />
        <LoadDialog loadDialogOpen={this.state.loadDialogOpen} />
      </div>
    );
  }
}

export default withRouter(App);
