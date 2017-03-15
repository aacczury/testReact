import React, { Component } from 'react';
import {ActionHome, ImageExposurePlus1} from 'material-ui/svg-icons';
import {Card, CardTitle, CardText, IconButton} from 'material-ui';

import ParticipantInfo from '../components/ParticipantInfo';
import '../components/ResTable.css';

class Participants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: []
    };

    this.dataRef = window.firebase.database().ref(`/participants/ncku/${this.props.th}/${this.props.sport}`);
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
    if (nextProps.th !== this.props.th || nextProps.sport !== this.props.sport) {
      this.dataRef.off('value', this.dataListener);
      this.dataRef = window.firebase.database().ref(`/participants/ncku/${nextProps.th}/${nextProps.sport}`);
      let self = this;
      this.dataListener = this.dataRef.on('value', function(snapshot) {
        console.log(snapshot.val());
        self.updateParticipants(snapshot.val());
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
      <ParticipantInfo key={"ParticipantInfo_-3"} user={this.props.user} th={this.props.th} uid={data.coach} status="教練" />,
      <ParticipantInfo key={"ParticipantInfo_-2"} user={this.props.user} th={this.props.th} uid={data.manager} status="管理" />,
      <ParticipantInfo key={"ParticipantInfo_-1"} user={this.props.user} th={this.props.th} uid={data.leader} status="隊長" />
    ]

    if(data.member){
      Object.keys(data.member).map((uid, index) => {
        tableData.push(<ParticipantInfo key={`ParticipantInfo_${index}`} user={this.props.user} th={this.props.th} uid={uid} status="隊員"
                            handleRemoveParticipantInfo={this.handleRemoveParticipantInfo(uid)} />);
        return 0;
      });
    }

    this.setState({ // need loading
      tableData: tableData
    });
  }

  removeParticipant = () => {
    if(Object.keys(this.tmpRemove).length > 0)
      window.firebase.database().ref().update(
        Object.keys(this.tmpRemove).reduce((p, c) => {
          if(this.tmpRemove[c])
            p[`/participant/ncku/${this.props.th}/${c}`] = null;
          return p;
        }, {}), (err) => {
        if(err) console.log(err);
        if(this.dataRef && this.dataRef.off){
          this.dataRef.off();
        }
      });
  }

  handleAddParticipantInfo = () => {
    let uid = window.firebase.database().ref(`/participant/ncku/${this.props.th}/`).push().key;
    window.firebase.database().ref().update({
      [`/participant/ncku/${this.props.th}/${uid}`]: {status: "member", sport: this.props.sport},
      [`/participants/ncku/${this.props.th}/${this.props.sport}/member/${uid}`]: true
    }, (err) => {
      // will update by on
      if(err) console.log(err);
    });
  }

  handleRemoveParticipantInfo = (uid, isRemove = true) => {
    return () => {
      window.firebase.database().ref().update({
        [`/participants/ncku/${this.props.th}/${this.props.sport}/member/${uid}`] : isRemove ? null : true
      }, (err) => { // can add redo
        this.tmpRemove = Object.assign(this.tmpRemove, {[uid]: isRemove});
      });
    }
  }

  render() {
    let cancelHeadCell = null;
    if(true) // need check author
      cancelHeadCell = (<th></th>)

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <div><ActionHome /></div>
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
                  <tr>
                    <td colSpan="10">
                      <IconButton>
                        <ImageExposurePlus1 onTouchTap={this.handleAddParticipantInfo} />
                      </IconButton>
                    </td>
                  </tr>
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
