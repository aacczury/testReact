import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let self = this;
    var firebaseuiConfig = {
      'callbacks': {
        'signInSuccess': function(user, credential, redirectUrl) {
          console.log(user);
          let userId = user.uid;
          window.firebase.database().ref(`/users/${userId}`).once('value').then(function(snapshot) {
            console.log(snapshot.val());
            if(!snapshot.val()) {
              window.firebase.database().ref(`/users/${userId}`).set({
                display_name: user.displayName
              }).then(() => self.props.handleRedirect("/"));
            }else {
              self.props.handleRedirect("/");
            }
          });
          //if(!user.emailVerified){
          //  user.sendEmailVerification().then(function(){
          //    dialog.showModal();
          //  });
          //  return false;
          //}else
          return false;
        }
      },
      'signInSuccessUrl': '/',
      'signInOptions': [
        window.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        window.firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      'tosUrl': 'https://www.google.com/policies/terms/'
    };

    if(document.querySelector("#firebaseui-auth-container")){
      window.firebaseuiContainer.start('#firebaseui-auth-container', firebaseuiConfig);
    }
  }

  render() {
    let content = (
        <div style={{paddingTop: "64px"}} id="firebaseui-auth-container"></div>
    )

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default Login;
