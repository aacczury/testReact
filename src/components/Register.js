import React, { Component } from 'react';

import InputContainer from '../containers/InputContainer';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputData: [],
      userReg: {},
      user: null
    };

    this.handleRegUpdate = this.handleRegUpdate.bind(this);
    this.handleRegUpdateClick = this.handleRegUpdateClick.bind(this);
    if(this.props.user){
      let user = this.props.user;
      let userId = user.uid;
      let self = this;
      window.firebase.database().ref(`/user_register/${this.props.th}/${userId}`).once('value').then(function(snapshot) {
        console.log("QQ");
        let userValue = snapshot.val() ? snapshot.val() : {};
        let userReg = {
          'sport': userValue.sport,
          'name': userValue.name,
          'id': userValue.id,
          'birthday': userValue.birthday,
          'phone': userValue.phone,
          'address': userValue.address,
          'size': userValue.size,
          'lodging': userValue.lodging,
          'bus': userValue.bus,
          'vegetarian': userValue.vegetarian
        }

        self.setState({ // need loading
          user: user,
          inputData: [
            { type: "text", name: "sport", text: "比賽項目", value: userReg.sport, disabled: false },
            { type: "text", name: "name", text: "姓名", value: userReg.name, disabled: false },
            { type: "text", name: "id", text: "身分證字號", value: userReg.displayName, disabled: false },
            { type: "date", name: "birthday", text: "生日", value: userReg.birthday, disabled: false },
            { type: "text", name: "phone", text: "連絡電話", value: userReg.phone, disabled: false },
            { type: "text", name: "address", text: "地址", value: userReg.address, disabled: false },
            { type: "text", name: "size", text: "衣服尺寸", value: userReg.size, disabled: false },
            { type: "checkbox", name: "lodging", text: "住宿", value: userReg.lodging, disabled: false },
            { type: "checkbox", name: "bus", text: "搭乘遊覽車", value: userReg.bus, disabled: false },
            { type: "checkbox", name: "vegetarian", text: "素食", value: userReg.vegetarian, disabled: false }
          ],
          userReg: userReg,
          prevUserReg: JSON.parse(JSON.stringify(userReg))
        });
      });
    }
  }

  handleRegUpdate(d) {
    this.setState(prevState => {
      return {userRegister: Object.assign(prevState.userInfo, d)};
    });
  }

  handleRegUpdateClick() {
    if(this.state.user) {
      let userId = this.state.user.uid;
      window.firebase.database().ref(`/register/${this.props.th}/${userId}`).update({
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

export default Register;
