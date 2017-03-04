import React, { Component } from 'react';
import {ActionHome} from 'material-ui/svg-icons';

import CardContainer from '../containers/CardContainer';

class Sports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: []
    };
  }

  componentDidMount() {
    if(this.props.user){ // need varify
      let self = this;
      this.dataRef = window.firebase.database().ref(`/sports/${this.props.th}`);
      this.dataRef.once('value').then(function(snapshot) {
        self.updateSports(snapshot.val());
      });
      this.dataRef.on('value', function(snapshot) {
        self.updateSports(snapshot.val());
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  handleAddSport = () => { // pop screen
    let sportName = "boyBaseball"; // need check collision
    let sportTitle = "男子籃球";
    let sportArena = "自強XX";
    let coachUid = window.firebase.database().ref(`/participant/ncku/${this.props.th}/coach`).push().key;
    let managerUid = window.firebase.database().ref(`/participant/ncku/${this.props.th}/manager`).push().key;
    let leaderUid = window.firebase.database().ref(`/participant/ncku/${this.props.th}/leader`).push().key;
    window.firebase.database().ref().update({
      [`/sports/${this.props.th}/${sportName}`]: {title: sportTitle, arena: sportArena},
      [`/participants/ncku/${this.props.th}/${sportName}`]: {coach: coachUid, manager: managerUid, leader: leaderUid}
    }, (err) => {
      // will update by on
      if(err) console.log(err);
    });
  }

  updateSports = (d) => {
    // need loading icon
    let data = d ? d : {};
    let cardData = [];
    Object.keys(data).map(k => {
      cardData.push({ title: data[k].title, subtitle: data[k].arena, url: `/${this.props.th}/${k}` });
      return 0;
    });

    this.setState({ // need loading
      cardData: cardData
    });
  }

  render() {
    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          <CardContainer cardData={this.state.cardData} router={this.props.router}
            cardHeight={170}
            plus1Position="before" handlePlus1={this.handleAddSport} />
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

export default Sports;
