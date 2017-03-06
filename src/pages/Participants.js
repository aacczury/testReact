import React, { Component } from 'react';
import {ActionHome} from 'material-ui/svg-icons';

import ParticipantInfo from '../components/ParticipantInfo'
import CardContainer from '../containers/CardContainer';

class Participants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: []
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
      this.dataRef.on('value', function(snapshot) {
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
    let cardData = [
      { title: "教練", content: (<ParticipantInfo user={this.props.user} th={this.props.th} uid={data.coach} />) },
      { title: "管理", content: (<ParticipantInfo user={this.props.user} th={this.props.th} uid={data.manager} />) },
      { title: "隊長", content: (<ParticipantInfo user={this.props.user} th={this.props.th} uid={data.leader} />) }
    ];

    if(data.member){
      Object.keys(data.member).map(uid => {
        cardData.push({ title: "隊員", uid: uid, content: (<ParticipantInfo user={this.props.user} th={this.props.th} uid={uid} />) });
        return 0;
      });
    }

    this.setState({ // need loading
      cardData: cardData
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
    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          <CardContainer cardData={this.state.cardData} router={this.props.router}
            handleRemoveParticipantInfo={this.handleRemoveParticipantInfo}
            cardHeight={620}
            plus1Position="after" handlePlus1={this.handleAddParticipantInfo} />
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
