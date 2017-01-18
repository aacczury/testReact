import React, { Component } from 'react';

import Header from './Header.js';

import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var uiConfig = {
      'callbacks': {
        'signInSuccess': function(user, credential, redirectUrl) {
          //if(!user.emailVerified){
          //  user.sendEmailVerification().then(function(){
          //    dialog.showModal();
          //  });
          //  return false;
          //}else
          return true;
        }
      },
      'signInSuccessUrl': '/',
      'signInOptions': [
        window.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        window.firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      'tosUrl': 'https://www.google.com/policies/terms/'
    };

    var ui = new window.firebaseui.auth.AuthUI(window.firebase.auth());
    if(document.querySelector("#firebaseui-auth-container"));
      ui.start('#firebaseui-auth-container', uiConfig);
  }

  render() {
    //console.log(this.state.isUserLogin);

    let header = <Header title="登入" />;
    let page = (
      <main className="mdl-layout__content">
        <div id="firebaseui-auth-container" style={{marginTop: "50px"}}></div>
      </main>
    );

    return (
      <div className="Login mdl-layout mdl-js-layout">
        {header}
        {page}
      </div>
    );
  }
}

export default Login;
