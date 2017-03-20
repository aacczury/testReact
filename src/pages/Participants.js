import React, { Component } from 'react';
import {ActionHome, ImageExposurePlus1} from 'material-ui/svg-icons';
import {Card, CardTitle, CardText, IconButton} from 'material-ui';

import ParticipantInfo from '../components/ParticipantInfo';
import Input from '../components/Input';
import '../components/ResTable.css';

class Participants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      contact: {
        name: "",
        phone: ""
      }
    };
    this.tmpUpload = {};
    this.uploadTimer = null;

    this.dataRef = window.firebase.database().ref(`/participants/${this.props.university}/${this.props.th}/${this.props.sport}`);
    this.tmpRemove = {};
  }

  beforeunload = () => {
    this.removeParticipant();
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.beforeunload);
    if(this.props.user){ // need varify
      let self = this;
      this.dataListener = this.dataRef.on('value', function(snapshot) {
        self.updateParticipants(snapshot.val());
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.th !== this.props.th || nextProps.sport !== this.props.sport || nextProps.university !== this.props.university) {
      this.dataRef.off('value', this.dataListener);
      this.dataRef = window.firebase.database().ref(`/participants/${nextProps.university}/${nextProps.th}/${nextProps.sport}`);
      let self = this;
      this.dataListener = this.dataRef.on('value', function(snapshot) {
        console.log(snapshot.val());
        self.updateParticipants(snapshot.val());
      }, err => {
        console.log(err);
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.beforeunload);
    this.removeParticipant();
  }

  updateParticipants = (d) => {
    // need loading icon
    let data = d ? d : {};
    let tableData = [
      <ParticipantInfo key={"ParticipantInfo_-3"} user={this.props.user} university={this.props.university} th={this.props.th} uid={data.coach} status="教練" />,
      <ParticipantInfo key={"ParticipantInfo_-2"} user={this.props.user} university={this.props.university} th={this.props.th} uid={data.manager} status="管理" />,
      <ParticipantInfo key={"ParticipantInfo_-1"} user={this.props.user} university={this.props.university} th={this.props.th} uid={data.leader} status="隊長" />
    ]

    if(data.member) {
      Object.keys(data.member).map((uid, index) => {
        if(this.props.user.auth === "admin")
          tableData.push(<ParticipantInfo key={`ParticipantInfo_${index}`} user={this.props.user} university={this.props.university} th={this.props.th} uid={uid}
            status="隊員" handleRemoveParticipantInfo={this.handleRemoveParticipantInfo(uid)} />);
        else
          tableData.push(<ParticipantInfo key={`ParticipantInfo_${index}`} user={this.props.user} university={this.props.university} th={this.props.th} uid={uid}
            status="隊員" />);
        return 0;
      });
    }

    this.setState({ // need loading
      tableData: tableData,
      contact: data.contact
    });
  }

  removeParticipant = () => {
    if(Object.keys(this.tmpRemove).length > 0)
      window.firebase.database().ref().update(
        Object.keys(this.tmpRemove).reduce((p, c) => {
          if(this.tmpRemove[c])
            p[`/participant/${this.props.university}/${this.props.th}/${c}`] = null;
          return p;
        }, {}), (err) => {
        if(err) console.log(err);
        if(this.dataRef && this.dataRef.off){
          this.dataRef.off();
        }
      });
  }

  handleAddParticipantInfo = () => {
    let uid = window.firebase.database().ref(`/participant/${this.props.university}/${this.props.th}/`).push().key;
    window.firebase.database().ref().update({
      [`/participant/${this.props.university}/${this.props.th}/${uid}`]: {status: "member", sport: this.props.sport},
      [`/participants/${this.props.university}/${this.props.th}/${this.props.sport}/member/${uid}`]: true
    }, (err) => {
      // will update by on
      if(err) console.log(err);
    });
  }

  handleRemoveParticipantInfo = (uid, isRemove = true) => {
    return () => {
      window.firebase.database().ref().update({
        [`/participants/${this.props.university}/${this.props.th}/${this.props.sport}/member/${uid}`] : isRemove ? null : true
      }, (err) => { // can add redo
        this.tmpRemove = Object.assign(this.tmpRemove, {[uid]: isRemove});
      });
    }
  }

  uploadContact = (d) => {
    if(this.props.user && this.props.th && this.props.university && this.props.sport && this.dataRef){ // need varify
      let self = this;
      this.dataRef.child('contact').update(this.tmpUpload, (err) => {
        self.tmpUpload = {};
      });
    }
  }

  handleContactUpdate = d => {
    this.setState(prevState => {
      let curContact = Object.assign(prevState.contact, d);
      return {
        contact: curContact
      };
    });
    this.tmpUpload = Object.assign(this.tmpUpload, d);
    if(this.uploadTimer) clearTimeout(this.uploadTimer);
    this.uploadTimer = setTimeout(() => this.uploadContact(this.tmpUpload), 3000);
  }



  render() {
    let cancelHeadCell = (<th></th>);

    let plus1 = null;
    if(this.props.user.auth === "admin")
      plus1 = (
        <tr>
          <td colSpan="10">
            {<IconButton>
              <ImageExposurePlus1 onTouchTap={this.handleAddParticipantInfo} />
            </IconButton>}
          </td>
        </tr>
      );

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <div><ActionHome /></div>
          <div>
            <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
              <CardText>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>姓名</th>
                      <th>電話</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td style={{fontWeight: "900", fontSize: "16px"}}>聯絡人</td>
                      <td data-label="姓名">
                        <Input type="text" name="name" value={this.state.contact.name} handleInputUpdate={this.handleContactUpdate} />
                      </td>
                      <td data-label="電話">
                        <Input type="text" name="phone" value={this.state.contact.phone} handleInputUpdate={this.handleContactUpdate} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardText>
            </Card>
          </div>

          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title={this.props.title} subtitle={this.props.subtitle}  />
            <CardText>
              <table>
                <thead>
                  <tr>
                    {cancelHeadCell}
                    <th>身分</th>
                    <th>姓名</th>
                    <th>系級</th>
                    <th>身分證字號</th>
                    <th>出生年月日</th>
                    <th>衣服尺寸</th>
                    <th>住宿</th>
                    <th>搭乘遊覽車</th>
                    <th>素食</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.tableData}
                  {plus1}
                </tbody>
              </table>
            </CardText>
          </Card>
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

export default Participants;
