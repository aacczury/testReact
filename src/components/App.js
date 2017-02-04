import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

//import Header from './Header';
import UserInfo from './UserInfo';
import Register from './Register';
import Main from './Main';

//import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };

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
    var header = (
      <AppBar
        title="正興城灣盃"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    );
      /*this.state.user ?
      <Header title="正興城灣盃" buttonTitle="Logout" isUserLogin={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("logout")}  /> :
      <Header title="正興城灣盃" buttonTitle="Login" isUserLogin={this.state.user} handleHeaderButtonClick={this.handleHeaderButtonClick("login")}  />;*/

    let page = null;
    if(this.props.params.th && this.state.user)
      page = <Register th={this.props.params.th} user={this.state.user} />
    else if(this.state.user)
      page = <UserInfo user={this.state.user} />;
    else
      page = <Main />;

    return (
      <MuiThemeProvider>
        {page}
      </MuiThemeProvider>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default App;
