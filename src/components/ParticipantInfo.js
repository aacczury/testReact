import React, { Component } from 'react';

import {attrList, attrName, attrType, highStatusList} from '../config';
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
    if (highStatusList.indexOf(ptcInfo.status) !== -1) {
      let attr = "name";
      return [{type: attrType[attr], name: attr, label: attrName[attr], value: ptcInfo[attr], errorText: errorText[attr]}];
    }

    return attrList.map(attr => {
      return {type: attrType[attr], name: attr, label: attrName[attr], value: ptcInfo[attr], errorText: errorText[attr]};
    })
  }

  updateParticipantInfo = (d, e = {}) => {
    // need loading icon
    let data = d ? d : {};
    let ptcInfo = {};
    attrList.map(attr => {
      ptcInfo[attr] = typeof data[attr] === 'undefined' ? (attrType[attr] !== 'checkbox' ? '' : false) : data[attr];
      return 0;
    });
    ptcInfo.status = "status" in data ? data.status : "";

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
