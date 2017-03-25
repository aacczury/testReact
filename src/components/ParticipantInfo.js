import React, { Component } from 'react';

import ResTR from './ResTR'

class ParticipantInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputData: [],
      ptcInfo: {}
    };

    this.dataRef = window.firebase.database().ref(`/participant/${this.props.university}/${this.props.th}/${this.props.uid}`);
  }

  componentDidMount = () => {
    if(this.props.user && this.props.th && this.props.uid && this.dataRef){ // need varify
      let self = this;
      this.dataRef.once('value').then(snapshot => {
        self.updateParticipantInfo(snapshot.val());
      }, err => err && console.log(err));
    }
  }

  componentWillReceiveProps = (nextProps) => {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.th !== this.props.th || nextProps.uid !== this.props.uid || nextProps.university !== this.props.university) {
      this.dataRef = window.firebase.database().ref(`/participant/${nextProps.university}/${nextProps.th}/${nextProps.uid}`);
      let self = this;
      this.dataRef.once('value').then(snapshot => {
        self.updateParticipantInfo(snapshot.val());
      }, err => err && console.log(err));
    }
    else if(nextProps.errorPtc || this.props.errorPtc) {
      this.updateParticipantInfo(this.state.ptcInfo, nextProps.errorPtc ? nextProps.errorPtc : {});
    }
  }

  componentWillUnmount = () => {
  }

  createInputData = (ptcInfo, errorText = {}) => {
    return [
      { type: "text", name: "name", label: "姓名", value: ptcInfo.name, disabled: false, errorText: errorText.name },
      { type: "text", name: "deptyear", label: "系級", value: ptcInfo.deptyear, disabled: false, errorText: errorText.deptyear },
      { type: "text", name: "id", label: "身分證字號", value: ptcInfo.id, disabled: false, errorText: errorText.id },
      { type: "date", name: "birthday", label: "生日", value: ptcInfo.birthday, disabled: false, errorText: errorText.birthday },
      { type: "text", name: "size", label: "衣服尺寸", value: ptcInfo.size, disabled: false, errorText: errorText.size },
      { type: "checkbox", name: "lodging", label: "住宿", value: ptcInfo.lodging, disabled: false },
      { type: "checkbox", name: "bus", label: "搭乘遊覽車", value: ptcInfo.bus, disabled: false },
      { type: "checkbox", name: "vegetarian", label: "素食", value: ptcInfo.vegetarian, disabled: false }
    ]
  }

  updateParticipantInfo = (d, e = {}) => {
    // need loading icon
    let data = d ? d : {};
    let ptcInfo = {
      name: typeof data.name === 'undefined' ? '' : data.name,
      deptyear: typeof data.deptyear === 'undefined' ? '' : data.deptyear,
      id: typeof data.id === 'undefined' ? '' : data.id,
      birthday: typeof data.birthday === 'undefined' ? '' : data.birthday,
      size: typeof data.size === 'undefined' ? '' : data.size,
      lodging: typeof data.lodging === 'undefined' ? false : data.lodging,
      bus: typeof data.bus === 'undefined' ? false : data.bus,
      vegetarian: typeof data.vegetarian === 'undefined' ? false : data.vegetarian
    }
    let inputData = this.createInputData(ptcInfo, e);
    this.setState({ // need loading
      inputData: inputData,
      ptcInfo: ptcInfo
    });
    this.props.handleUpdatePtcInfo({[this.props.uid]: ptcInfo});
  }

  handleParticipantInfoUpdate = (d) => {
    this.setState(prevState => {
      let curPtcInfo = Object.assign(prevState.ptcInfo, d);
      this.props.handleUpdatePtcInfo({[this.props.uid]: curPtcInfo});
      return {
        ptcInfo: curPtcInfo,
        inputData: this.createInputData(curPtcInfo)
      };
    });
  }

  render() {
    return <ResTR status={this.props.status} inputData={this.state.inputData}
      handleInputUpdate={this.handleParticipantInfoUpdate} handleRemoveParticipantInfo={this.props.handleRemoveParticipantInfo} />
  }
}

export default ParticipantInfo;
