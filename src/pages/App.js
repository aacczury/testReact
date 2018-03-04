import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoadDialog from '../components/LoadDialog';
import Header from '../partials/Header';
import Main from './Main';
import Login from './Login';
import Years from './Years';
import Sports from './Sports';
import Participants from './Participants';
import Overview from './Overview';
import Group from './Group';

import { UNIVERSITY_LIST } from '../constants/constants'
import { fetchUserDataIfNeeded } from '../actions'
//import './App.css';

class App extends Component {
  static propTypes = {
    userData: PropTypes.object.isRequired
  }

  componentDidMount() {
    let { location, fetchUserDataIfNeeded } = this.props;
    let self = this;
    window.firebase.auth().onAuthStateChanged(user => {
      if (user && location.query.login)
        self.handleRedirect('/');

      if (user) {
        fetchUserDataIfNeeded(user.uid)
      }
    });
  }

  handleRedirect = url => {
    this.props.router.push(url);
  }

  handleHeaderButtonClick = event => {
    return {
      logout: () => {
        let self = this;
        window.firebase.auth().signOut().then(function () {
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
    let { userData } = this.props;
    let query = this.props.location.query;
    if (userData.auth !== null) {
      let university = null;
      if (userData.auth === "admin" || userData.auth === "overview") {
        university = query.university ? query.university : "ncku";
      } else {
        if (UNIVERSITY_LIST.indexOf(userData.auth) < 0) {
          console.log("Error university"); // need handle
        }
        else if (query.university && userData.auth !== query.university) {
          console.log("Not your university");
        }
        else
          university = userData.auth;
      }

      if (query.th) {
        if (query.group && (userData.auth === "admin" || userData.auth === "overview")) {
          header = <Header title={`正興城灣盃-第${query.th}屆總覽`} user={userData}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Group user={userData} th={query.th} university={university} />
        }
        else if (query.overview && (userData.auth === "admin" || userData.auth === "overview")) {
          header = <Header title={`正興城灣盃-第${query.th}屆總覽`} user={userData}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Overview user={userData} th={query.th} university={university} />
        }
        else if (query.sport && university) {
          header = <Header title={`正興城灣盃-第${query.th}屆報名資料`} user={userData}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Participants user={userData} th={query.th} sport={query.sport} university={university} handleRedirect={this.handleRedirect} />
        }
        else if (!query.sport) {
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} user={userData}
            handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} th={query.th} />
          content = <Sports user={userData} handleRedirect={this.handleRedirect} th={query.th} />
        }
        else {
          header = <Header title={`正興城灣盃-第${query.th}屆比賽項目`} />
          content = <h1>有些出錯</h1>
        }
      }
      else {
        header = <Header title="正興城灣盃-歷屆資料" user={userData}
          handleHeaderButtonClick={this.handleHeaderButtonClick("logout")} handleRedirect={this.handleRedirect} />
        content = <Years user={userData} handleRedirect={this.handleRedirect} />;
      }
    }
    else if (query.login) {
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
        <LoadDialog />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return Object.freeze({
    userData: state.userData
  })
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUserDataIfNeeded: uid => {
      dispatch(fetchUserDataIfNeeded(uid));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);