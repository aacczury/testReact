import React, { Component } from 'react';

import InputContainer from '../containers/InputContainer.js';

class UserInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputData: [],
      userInfo: {},
      user: null
    };

    this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
    this.handleInfoUpdateClick = this.handleInfoUpdateClick.bind(this);

    if(this.props.user){
      let user = this.props.user;
      let userId = user.uid;
      let self = this;
      window.firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        let userValue = snapshot.val() ? snapshot.val() : {};
        let userInfo = {
          email: user.email,
          displayName: userValue.displayName ? userValue.displayName : user.displayName
        }

        self.setState({ // need loading
          user: user,
          inputData: [
            { type: "email", name: "email", text: "電子信箱", value: userInfo.email, disabled: true },
            { type: "text", name: "displayName", text: "顯示名稱", value: userInfo.displayName, disabled: false },
          ],
          userInfo: {
            displayName: userInfo.displayName
          }
        });
      });
    }
  }

  handleInfoUpdate(d){
    this.setState(prevState => {
      return {userInfo: Object.assign(prevState.userInfo, d)};
    })
  }

  handleInfoUpdateClick() {
    if(this.state.user) {
      let userId = this.state.user.uid;
      window.firebase.database().ref('/users/' + userId).update({
        displayName: this.state.userInfo.displayName
      });
    }
  }

  render() {
    return (
      <main className="mdl-layout__content" style={{marginTop: "50px"}}>
        <div className="mdl-typography--text-center">
          <InputContainer inputData={this.state.inputData} handleInfoUpdate={this.handleInfoUpdate} />
          <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent"
            onClick={this.handleInfoUpdateClick}>
            更新
          </button>
        </div>
      </main>
    );
  }
}

export default UserInfo;
