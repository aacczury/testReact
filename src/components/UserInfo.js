import React, { Component } from 'react';
import {RaisedButton} from 'material-ui';
import {ActionHome} from 'material-ui/svg-icons';

import InputContainer from '../containers/InputContainer';

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
      window.firebase.database().ref(`/users/${userId}`).once('value').then(function(snapshot) {
        // need loading icon
        let userValue = snapshot.val() ? snapshot.val() : {};
        let userInfo = {
          email: user.email,
          displayName: userValue.display_name ? userValue.display_name : user.displayName
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
      console.log("Update Info");
      let userId = this.state.user.uid;
      window.firebase.database().ref(`/users/${userId}`).update({
        'display_name': this.state.userInfo.displayName
      });
    }
  }

  render() {
    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          <div style={{width: "256px", margin: "0px auto", textAlign: "left"}}>
            <InputContainer inputData={this.state.inputData} handleInputUpdate={this.handleInfoUpdate} />
          </div>
          <RaisedButton
            secondary={true}
            label="更新"
            onTouchTap={this.handleInfoUpdateClick}
          />
        </div>
      </div>
    );

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default UserInfo;
