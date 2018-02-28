import React, { Component } from 'react';
import {Card, CardText, RaisedButton} from 'material-ui';

import InputContainer from '../containers/InputContainer';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        email: '',
        password: ''
      },
      errorText: {
        email: '',
        password: ''
      },
      inputData: [],
      isLoginButtonDisabled: false
    };
  }

  componentDidMount() {
    let inputData = this.createInputData(this.state.userInfo, this.state.errorText);
    this.setState({
      inputData: inputData
    });
  }

  createInputData = (userInfo, errorText) => {
    return [
      { type: "text", name: "email", text: "信箱", value: userInfo.email, disabled: false, errorText: errorText.email},
      { type: "password", name: "password", text: "密碼", value: userInfo.password, disabled: false, errorText: errorText.password }
    ]
  }

  handleUserInfoUpdate = (d) => {
    this.setState(prevState => {
      let curUserInfo = Object.assign(prevState.userInfo, d);
      return {
        userInfo: curUserInfo,
        inputData: this.createInputData(curUserInfo, this.state.errorText)
      };
    });
  }

  updateErrorText = (d) => {
    this.setState(prevState => {
      let curErrorText = Object.assign(prevState.errorText, d);
      return {
        errorText: curErrorText,
        inputData: this.createInputData(this.state.userInfo, curErrorText)
      };
    });
  }

  handleLogin = () => {
    this.updateErrorText({email: '', password: ''});
    if (window.firebase.auth().currentUser) {
      alert("你已經登入惹")
    }
    else {
      let email = this.state.userInfo.email;
      let password = this.state.userInfo.password;
      if (email.length < 4) {
        this.updateErrorText({email: '信箱格式錯誤'});
        return;
      }
      if (password.length < 6) {
        this.updateErrorText({password: '密碼長度錯誤'});
        return;
      }

      this.setState({isLoginButtonDisabled: true});
      this.props.handleLoadDialogOpen();
      let self = this;
      window.firebase.auth().signInWithEmailAndPassword(email, password).catch(err => {
        var errorCode = err.code;
        var errorMessage = err.message;
        if(errorCode === 'auth/invalid-email'){
          self.updateErrorText({email: '信箱格式錯誤'});
        } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          self.updateErrorText({email: '帳號或密碼錯誤', password: '帳號或密碼錯誤'});
        } else if (err) {
          console.error(err);
          self.updateErrorText({email: errorMessage});
        }
        if(err) this.props.handleLoadDialogClose();

        self.setState({isLoginButtonDisabled: false});
      });
    }
  }

  render() {
    let content = (
      <div style={{textAlign: "center"}}>
        <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
          <CardText>
            <InputContainer inputData={this.state.inputData} handleInputUpdate={this.handleUserInfoUpdate} />
            <RaisedButton
              label="登入"
              secondary={true}
              onTouchTap={this.handleLogin}
              disabled={this.state.isLoginButtonDisabled}
            />
          </CardText>
        </Card>
      </div>
    )

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default Login;
