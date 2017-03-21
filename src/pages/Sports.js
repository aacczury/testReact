import React, { Component } from 'react';
import {FlatButton} from 'material-ui';
import {ActionHome} from 'material-ui/svg-icons';

import AddCard from '../components/AddCard';
import AddDialog from '../components/AddDialog';
import CardContainer from '../containers/CardContainer';
import InputContainer from '../containers/InputContainer';

class Sports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: [],
      addSportData: [],
      addSportInfo: {
        title: '',
        coach: true,
        captain: true,
        manager: true,
        leader: true,
        member: true
      },
      addDialogOpen: false,
      isNCKUHost: false,
      isLoadingHost: false
    };
  }

  componentDidMount() {
    if(this.props.user){ // need varify
      let self = this;
      window.firebase.database().ref(`/years`).once('value').then(function(snapshot){
        let data = snapshot.val() ? snapshot.val() : {};
        Object.keys(data).map(k => {
          if(data[k].th === self.props.th)
            self.setState({isNCKUHost: data[k].ncku_host});
          return 0;
        })
        self.setState({isLoadingHost: true});

        self.dataRef = window.firebase.database().ref(`/sports/${self.props.th}`);
        self.dataRef.on('value', function(snapshot) {
          self.updateSports(snapshot.val());
        });
        self.setState({
          addSportData: self.createAddSportData(self.state.addSportInfo)
        });
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  updateSports = (d) => {
    if(!this.state.isLoadingHost) {
      console.log("Wait loading host");
      setTimeout(() => this.updateSports(d), 1000);
      return ;
    }
    // need loading icon
    let data = d ? d : {};
    let cardData = [];
    Object.keys(data).map(sportUid => {
      if(!this.state.isNCKUHost || this.props.user.auth !== "admin")
        cardData.push({ title: data[sportUid].title, url: `/?th=${this.props.th}&university=ncku&sport=${sportUid}` });
      else {
        cardData.push({ title: data[sportUid].title, content: (
          <div>
            <FlatButton primary={true} label="NCKU" onTouchTap={() => this.props.handleRedirect(`/?th=${this.props.th}&university=ncku&sport=${sportUid}`)} />
            <FlatButton primary={true} label="CCU" onTouchTap={() => this.props.handleRedirect(`/?th=${this.props.th}&university=ccu&sport=${sportUid}`)} />
            <FlatButton primary={true} label="NSYSU" onTouchTap={() => this.props.handleRedirect(`/?th=${this.props.th}&university=nsysu&sport=${sportUid}`)} />
            <FlatButton primary={true} label="NCHU" onTouchTap={() => this.props.handleRedirect(`/?th=${this.props.th}&university=nchu&sport=${sportUid}`)} />
          </div>
        )});
      }
      return 0;
    });

    this.setState({ // need loading
      cardData: cardData
    });
  }

  createAddSportData = (addSportInfo) => {
    return [
      { type: "text", name: "title", text: "中文全稱 ex:教職員網球", value: addSportInfo.title, disabled: false },
      { type: "checkbox", name: "coach", text: "教練", value: addSportInfo.coach, disabled: false },
      { type: "checkbox", name: "captain", text: "領隊", value: addSportInfo.captain, disabled: false },
      { type: "checkbox", name: "manager", text: "管理", value: addSportInfo.manager, disabled: false },
      { type: "checkbox", name: "leader", text: "隊長", value: addSportInfo.leader, disabled: false },
      { type: "checkbox", name: "member", text: "隊員/成員", value: addSportInfo.member, disabled: true }
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
    console.log(this.state.addSportInfo);
    if(this.props.user.auth === "admin") {
      if(!this.state.isLoadingHost) {
        console.log("Not loading host");
        return ;
      }

      let th = this.props.th;
      let {title} = this.state.addSportInfo;
      let universityName = this.state.isNCKUHost ? ["ncku", "ccu", "nsysu", "nchu"] : ["ncku"];
      let sportUid = window.firebase.database().ref(`/sports/${th}/`).push().key;
      let updates = {
        [`/sports/${th}/${sportUid}`]: {title: title}
      }
      universityName.map(university => {
        updates[`/participants/${university}/${th}/${sportUid}`] = {contact: {name: '', phone: '', email: ''}};
        Object.keys(this.state.addSportInfo).map(status => {
          if(status !== "title" && status !== "member" && this.state.addSportInfo[status]) {
            let uid = window.firebase.database().ref(`/participant/${university}/${th}`).push().key;
            updates[`/participants/${university}/${th}/${sportUid}`][status] = uid;
            updates[`/participant/${university}/${th}/${uid}`] = {status: status, sport: sportUid};
          }
          return 0;
        })
        return 0;
      });

      window.firebase.database().ref().update(updates, (err) => {
        // will update by on
        if(err) console.log(err);
        this.handleAddDialogClose();
        this.setState(prevState => {
          let curAddSportInfo = {
            title: '',
            coach: true,
            captain: true,
            manager: true,
            leader: true,
            member: true
          }
          return {addSportInfo: curAddSportInfo, addSportData: this.createAddSportData(curAddSportInfo)};
        });
      });
    }
  }

  handleAddDialogOpen = () => {
    this.setState({addDialogOpen: true})
  }

  handleAddDialogClose = () => {
    this.setState({addDialogOpen: false})
  }

  render() {
    let addCard = null;
    if(this.props.user.auth === "admin")
      addCard = <AddCard handlePlus1={this.handleAddDialogOpen} />;

    let addDialog = null;
    if(this.props.user.auth === "admin")
      addDialog =
        <AddDialog title="新增運動項目" addDialogOpen={this.state.addDialogOpen} handleAddSubmit={this.handleAddSport}
          handleAddDialogOpen={this.handleAddDialogOpen} handleAddDialogClose={this.handleAddDialogClose}
          content={<InputContainer inputData={this.state.addSportData} handleInputUpdate={this.handleAddSportInfoUpdate} />} />;

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          {addCard}
          <CardContainer cardData={this.state.cardData} handleRedirect={this.props.handleRedirect} />
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
