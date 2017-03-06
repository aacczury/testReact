import React, { Component } from 'react';
import {FlatButton, Dialog} from 'material-ui'
import {ActionHome} from 'material-ui/svg-icons';

import CardContainer from '../containers/CardContainer';
import InputContainer from '../containers/InputContainer';

class Sports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: [],
      addSportData: [],
      addSportInfo: {
        sportTitle: '',
        sportArena: ''
      },
      addDialogOpen: false
    };
  }

  componentDidMount() {
    if(this.props.user){ // need varify
      let self = this;
      this.dataRef = window.firebase.database().ref(`/sports/${this.props.th}`);
      this.dataRef.on('value', function(snapshot) {
        self.updateSports(snapshot.val());
      });
      this.setState({
        addSportData: this.createAddSportData(this.state.addSportInfo)
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  updateSports = (d) => {
    // need loading icon
    let data = d ? d : {};
    let cardData = [];
    Object.keys(data).map(sportUid => {
      cardData.push({ title: data[sportUid].title, subtitle: data[sportUid].arena, url: `/${this.props.th}/${sportUid}` });
      return 0;
    });

    this.setState({ // need loading
      cardData: cardData
    });
  }

  createAddSportData = (addSportInfo) => {
    return [
      { type: "text", name: "sportTitle", text: "中文名稱", value: addSportInfo.sportTitle, disabled: false },
      { type: "text", name: "sportArena", text: "比賽地點", value: addSportInfo.sportArena, disabled: false },
    ]
  }

  handleAddSportInfoUpdate = (d) => {
    this.setState(prevState => {
      let curAddSportInfo = Object.assign(prevState.addSportInfo, d);
      return {
        addSportInfo: curAddSportInfo,
        addSportData: this.createAddSportData(curAddSportInfo)
      };
    });
  }

  handleAddSport = () => { // pop screen
    let {sportTitle, sportArena} = this.state.addSportInfo; // need check collision
    let sportUid = window.firebase.database().ref(`/sports/${this.props.th}/`).push().key;
    let coachUid = window.firebase.database().ref(`/participant/ncku/${this.props.th}`).push().key;
    let managerUid = window.firebase.database().ref(`/participant/ncku/${this.props.th}`).push().key;
    let leaderUid = window.firebase.database().ref(`/participant/ncku/${this.props.th}`).push().key;
    window.firebase.database().ref().update({
      [`/sports/${this.props.th}/${sportUid}`]: {title: sportTitle, arena: sportArena},
      [`/participants/ncku/${this.props.th}/${sportUid}`]: {coach: coachUid, manager: managerUid, leader: leaderUid},
      [`/participant/ncku/${this.props.th}/${coachUid}`]: {status: "coach", sport: sportUid},
      [`/participant/ncku/${this.props.th}/${managerUid}`]: {status: "manager", sport: sportUid},
      [`/participant/ncku/${this.props.th}/${leaderUid}`]: {status: "leader", sport: sportUid}
    }, (err) => {
      // will update by on
      if(err) console.log(err);
      this.handleAddDialogClose();
      this.setState(prevState => {
        let curAddSportInfo = {
          sportTitle: '',
          sportArena: ''
        };
        return {
          addSportInfo: curAddSportInfo,
          addSportData: this.createAddSportData(curAddSportInfo)
        };
      });
    });
  }

  handleAddDialogOpen = () => {
    this.setState({
      addDialogOpen: true
    })
  }

  handleAddDialogClose = () => {
    this.setState({
      addDialogOpen: false
    })
  }

  render() {
    let addDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleAddDialogClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleAddSport}
      />,
    ];

    let addDialog = (
      <Dialog
        title="新增運動項目"
        actions={addDialogActions}
        modal={false}
        open={this.state.addDialogOpen}
        onRequestClose={this.handleAddDialogClose}
        contentStyle={{maxWidth: "300px"}}
      >
        <InputContainer inputData={this.state.addSportData} handleInputUpdate={this.handleAddSportInfoUpdate} />
      </Dialog>
    )

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          <CardContainer cardData={this.state.cardData} router={this.props.router}
            cardHeight={170}
            plus1Position="before" handlePlus1={this.handleAddDialogOpen} />
          {addDialog}
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
