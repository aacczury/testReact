import React, { Component } from 'react';
import {RaisedButton} from 'material-ui';
import {ContentCreate} from 'material-ui/svg-icons';

import InputContainer from '../containers/InputContainer';

class Register extends Component {
  constructor(props) {
    super(props);
    console.log("register construct");

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
        console.log("query user register");
        let userValue = snapshot.val() ? snapshot.val() : {};
        let userReg = {
          sport: userValue.sport ? userValue.sport : null,
          name: userValue.name ? userValue.name : null,
          id: userValue.id ? userValue.id : null,
          birthday: userValue.birthday ? userValue.birthday : null,
          phone: userValue.phone ? userValue.phone : null,
          address: userValue.address ? userValue.address : null,
          size: userValue.size ? userValue.size : null,
          lodging: userValue.lodging ? userValue.lodging : null,
          bus: userValue.bus ? userValue.bus : null,
          vegetarian: userValue.vegetarian ? userValue.vegetarian : null
        }

        self.setState({ // need loading
          user: user,
          inputData: [
            { type: "text", name: "sport", text: "比賽項目", value: userReg.sport, disabled: false },
            { type: "text", name: "name", text: "姓名", value: userReg.name, disabled: false },
            { type: "text", name: "id", text: "身分證字號", value: userReg.id, disabled: false },
            { type: "date", name: "birthday", text: "生日", value: userReg.birthday, disabled: false },
            { type: "text", name: "phone", text: "連絡電話", value: userReg.phone, disabled: false },
            { type: "text", name: "address", text: "地址", value: userReg.address, disabled: false },
            { type: "text", name: "size", text: "衣服尺寸", value: userReg.size, disabled: false },
            { type: "checkbox", name: "lodging", text: "住宿", value: userReg.lodging, disabled: false },
            { type: "checkbox", name: "bus", text: "搭乘遊覽車", value: userReg.bus, disabled: false },
            { type: "checkbox", name: "vegetarian", text: "素食", value: userReg.vegetarian, disabled: false }
          ],
          userReg: userReg,
          prevUserReg: JSON.parse(JSON.stringify(userReg)),
          dbAction: snapshot.val() ? 'update' : 'set'
        });
      });
    }
  }

  handleRegUpdate(d) {
    this.setState(prevState => {
      return {userReg: Object.assign(prevState.userReg, d)};
    });
  }

  handleRegUpdateClick() {
    if(this.state.user) {
      console.log(this.state.userReg);
      let userId = this.state.user.uid;
      window.firebase.database().ref(`/user_register/${this.props.th}/${userId}`)[this.state.dbAction]({
        // need loading icon
        'sport': this.state.userReg.sport,
        'name': this.state.userReg.name,
        'id': this.state.userReg.id,
        'birthday': this.state.userReg.birthday,
        'phone': this.state.userReg.phone,
        'address': this.state.userReg.address,
        'size': this.state.userReg.size,
        'lodging': this.state.userReg.lodging,
        'bus': this.state.userReg.bus,
        'vegetarian': this.state.userReg.vegetarian
      }).then(() => {
        if(this.state.dbAction === 'set')
          this.setState(() => {
            return {dbAction: 'update'}
          });
      });
    }
  }

  render() {
    let content = (
        <div style={{paddingTop: "64px"}}>
          <div style={{textAlign: "center"}}>
            <ContentCreate />
            <div style={{width: "256px", margin: "0px auto", textAlign: "left"}}>
              <InputContainer inputData={this.state.inputData} handleInputUpdate={this.handleRegUpdate} />
            </div>
            <RaisedButton
              secondary={true}
              label="更新"
              onTouchTap={this.handleRegUpdateClick}
            />
          </div>
        </div>
    )

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default Register;
