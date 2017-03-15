import React, { Component } from 'react';

import ResTR from './ResTR'

class ParticipantInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputData: [],
      ptcInfo: {}
    };
    this.tmpUpload = {};
    this.uploadTimer = null;
    if(this.props.th && this.props.uid)
      this.dataRef = window.firebase.database().ref(`/participant/ncku/${this.props.th}/${this.props.uid}`);
  }

  componentDidMount() {
    if(this.props.user && this.props.th && this.props.uid && this.dataRef){ // need varify
      let self = this;
      this.dataListener = this.dataRef.on('value', function(snapshot) {
        self.updateParticipantInfo(snapshot.val());
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.th !== this.props.th || nextProps.uid !== this.props.uid) {
      this.dataRef.off('value', this.dataListener);
      this.dataRef = window.firebase.database().ref(`/participant/ncku/${nextProps.th}/${nextProps.uid}`);
      let self = this;
      this.dataListener = this.dataRef.on('value', function(snapshot) {
        self.updateParticipantInfo(snapshot.val());
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off('value', this.dataListener);
    }
  }

  createInputData = (ptcInfo) => {
    return [
      { type: "text", name: "name", text: "姓名", value: ptcInfo.name, disabled: false },
      { type: "text", name: "deptyear", text: "系級", value: ptcInfo.deptyear, disabled: false },
      { type: "text", name: "id", text: "身分證字號", value: ptcInfo.id, disabled: false },
      { type: "date", name: "birthday", text: "出生年月日", value: ptcInfo.birthday, disabled: false },
      { type: "text", name: "size", text: "衣服尺寸", value: ptcInfo.size, disabled: false },
      { type: "checkbox", name: "lodging", text: "住宿", value: ptcInfo.lodging, disabled: false },
      { type: "checkbox", name: "bus", text: "搭乘遊覽車", value: ptcInfo.bus, disabled: false },
      { type: "checkbox", name: "vegetarian", text: "素食", value: ptcInfo.vegetarian, disabled: false }
    ]
  }

  updateParticipantInfo = (d) => {
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
    let inputData = this.createInputData(ptcInfo);
    this.setState({ // need loading
      inputData: inputData,
      ptcInfo: ptcInfo
    });
  }

  uploadParticipantInfo = (d) => {
    if(this.props.user && this.props.th && this.props.uid && this.dataRef){ // need varify
      let self = this;
      this.dataRef.update(this.tmpUpload, (err) => {
        self.tmpUpload = {};
      });
    }
  }

  handleParticipantInfoUpdate = (d) => {
    this.setState(prevState => {
      let curPtcInfo = Object.assign(prevState.ptcInfo, d);
      return {
        ptcInfo: curPtcInfo,
        inputData: this.createInputData(curPtcInfo)
      };
    });
    this.tmpUpload = Object.assign(this.tmpUpload, d);
    if(this.uploadTimer) clearTimeout(this.uploadTimer);
    this.uploadTimer = setTimeout(() => this.uploadParticipantInfo(this.tmpUpload), 3000);
  }

  render() {
    return <ResTR status={this.props.status} inputData={this.state.inputData}
      handleInputUpdate={this.handleParticipantInfoUpdate} handleRemoveParticipantInfo={this.props.handleRemoveParticipantInfo} />
  }
}

export default ParticipantInfo;
