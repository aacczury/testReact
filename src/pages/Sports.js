import React, { Component } from 'react';
import {FlatButton, Avatar, Chip} from 'material-ui';
import {ActionHome, ActionDone} from 'material-ui/svg-icons';

import AddCard from '../components/AddCard';
import AddDialog from '../components/AddDialog';
import CardContainer from '../containers/CardContainer';
import InputContainer from '../containers/InputContainer';
import LoadDialog from '../components/LoadDialog';
import { highStatusList } from '../config';

class Sports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: [],
      sportData: {},
      addSportData: [],
      addSportInfo: {
        title: '',
        coach: true,
        captain: true,
        manager: true,
        leader: true,
        member: true,
        member_num: 0
      },
      addDialogOpen: false,
      isNCKUHost: false,
      isLoadingHost: false,
      loadDialogOpen: true
    };

    this.tmpSave = {};
    this.tmpRemove = {};
  }

  componentDidMount = () => {
    window.addEventListener("beforeunload", this.beforeunload);
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
          console.log(snapshot.val())
          let th = self.props.th
          let university = "ncku"
          let updates = {}
          Object.keys(snapshot.val()).map((sportUid, index) => {
            window.firebase.database().ref(`/participants/${university}/${th}/${sportUid}`).once('value').then(sportPtcsSnapshot => {
              let sportPtcs = sportPtcsSnapshot.val() ? sportPtcsSnapshot.val() : {};
              highStatusList.map(status => {
                if (!(status in sportPtcs)) {
                  let uid = window.firebase.database().ref(`/participant/${university}/${th}`).push().key;
                  updates[`/participants/${university}/${th}/${sportUid}/${status}`] = uid;
                  updates[`/participant/${university}/${th}/${uid}`] = {status: status, sport: sportUid};
                }
                return 0
              })
            }).then(() => {
              if (index === Object.keys(snapshot.val()).length - 1 && Object.keys(updates).length > 0) {
                window.firebase.database().ref().update(updates);
              }
            })
            return 0
          })
          self.updateSports(snapshot.val());
        });
        self.setState({
          addSportData: self.createAddSportData(self.state.addSportInfo)
        });
      });
    }
  }

  componentWillUnmount = () => {
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
    const universityName = ["ncku", "ccu", "nsysu", "nchu"];
    Object.keys(data).map((sportUid, index) => {
      let sport = data[sportUid];
      if(!this.state.isNCKUHost || (this.props.user.auth !== "admin" && this.props.user.auth !== "overview")) {
        let university = "ncku";
        if(this.props.user.auth in universityName) university = this.props.user.auth;
        if(sport.is_finish && university in sport.is_finish && sport.is_finish[university]) {
          if(this.props.user.auth !== "admin" && this.props.user.auth !== "overview") {
            cardData.push({ order: 'order' in sport ? sport.order : +index + 1, title: sport.title, uid: sportUid, content: (
                <div style={{display: "inline-block"}}>
                  <Chip backgroundColor="#c8e6c9" color="#222"><Avatar color="#fff" backgroundColor="#4caf50" icon={<ActionDone  />} />已報名完成</Chip>
                </div>
              )});
          } else {
            cardData.push({ order: 'order' in sport ? sport.order : +index + 1, title: sport.title, uid: sportUid, content: (
                <div style={{display: "inline-block"}}>
                  <Chip backgroundColor="#c8e6c9" color="#222"><Avatar color="#fff" backgroundColor="#4caf50" icon={<ActionDone  />} />已報名完成</Chip>
                </div>
              ), url: `/?th=${this.props.th}&university=${university}&sport=${sportUid}`});
          }
        } else {
          cardData.push({ order: 'order' in sport ? sport.order : +index + 1, title: sport.title, uid: sportUid, content: (
              <div style={{display: "inline-block"}}>
                <Chip>尚未報名完成</Chip>
              </div>
            ), url: `/?th=${this.props.th}&university=${university}&sport=${sportUid}`});
        }
      }
      else {
        cardData.push({ order: 'order' in sport ? sport.order : +index + 1, title: sport.title, uid: sportUid, content: (
          <div>
            {universityName.map(university => {
              let bgcolor = null;
              let primary = true;
              if(sport.is_finish && university in sport.is_finish && sport.is_finish[university]){
                bgcolor = "#c8e6c9";
                primary = false;
              }
              return <FlatButton key={`btn_${university}`} backgroundColor={bgcolor} primary={primary} label={university.toUpperCase()}
                onTouchTap={() => this.props.handleRedirect(`/?th=${this.props.th}&university=${university}&sport=${sportUid}`)} />
            })}
          </div>
        )});
      }
      return 0;
    });

    cardData.sort((a, b) => {
      return a.order - b.order;
    })

    this.setState({ // need loading
      cardData: cardData,
      sportData: data,
      loadDialogOpen: false
    });
  }

  createAddSportData = (addSportInfo) => {
    return [
      { type: "text", name: "title", text: "中文全稱 ex:教職員網球", value: addSportInfo.title, disabled: false },
      { type: "checkbox", name: "coach", text: "教練", value: addSportInfo.coach, disabled: false },
      { type: "checkbox", name: "captain", text: "領隊", value: addSportInfo.captain, disabled: false },
      { type: "checkbox", name: "manager", text: "管理", value: addSportInfo.manager, disabled: false },
      { type: "checkbox", name: "leader", text: "隊長", value: addSportInfo.leader, disabled: false },
      { type: "checkbox", name: "member", text: "隊員/成員", value: addSportInfo.member, disabled: true },
      { type: "text", name: "member_num", text: "隊員/成員人數", value: addSportInfo.member_num, disabled: false },
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
          if(status !== "title" && status !== "member" && status !=="member_num" && this.state.addSportInfo[status]) {
            let uid = window.firebase.database().ref(`/participant/${university}/${th}`).push().key;
            updates[`/participants/${university}/${th}/${sportUid}`][status] = uid;
            updates[`/participant/${university}/${th}/${uid}`] = {status: status, sport: sportUid};
          } else if(status === "member" && !isNaN(+this.state.addSportInfo["member_num"]) && +this.state.addSportInfo["member_num"] > 0) {
            for(let i = 0; i < +this.state.addSportInfo["member_num"]; ++i){
              let uid = window.firebase.database().ref(`/participant/${university}/${th}`).push().key;
              if(!(status in updates[`/participants/${university}/${th}/${sportUid}`]))
                updates[`/participants/${university}/${th}/${sportUid}`][status] = {}
              Object.assign(updates[`/participants/${university}/${th}/${sportUid}`][status], {[uid]: true});
              updates[`/participant/${university}/${th}/${uid}`] = {status: status, sport: sportUid};
            }
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
            member: true,
            member_num: 0
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

  handleRemoveSport = (uid) => {
    return () => {
      if (this.props.user.auth !== "admin") return;
      let updates = {};
      updates[`/sports/${this.props.th}/${uid}`] = null;

      const statusName = ["coach", "captain", "manager", "leader", "member"]
      const universityName = this.state.isNCKUHost ? ["ncku", "ccu", "nchu", "nsysu"] : ["ncku"];
      for(let i = 0; i < universityName.length; ++i) {
        let university = universityName[i];
        window.firebase.database().ref(`/participants/${university}/${this.props.th}/${uid}`)
                .once('value').then(ptcShot => {
          let ptcs = ptcShot.val() ? ptcShot.val() : {};
          statusName.map(status => {
            if(!(status in ptcs)) return 1;
            if(status !== "member")
              updates[`/participant/${university}/${this.props.th}/${ptcs[status]}`] = null;
            else
              Object.keys(ptcs[status]).map(memberUid => {
                updates[`/participant/${university}/${this.props.th}/${memberUid}`] = null;
                return 0;
              })
            return 0;
          })
          updates[`/participants/${university}/${this.props.th}/${uid}`] = null;
          if(i === universityName.length - 1) // update at last
            window.firebase.database().ref().update(updates, (err) => err && console.error(err));
        }, err => err && console.error(err)) // end once ptcs
      } // end universityName for loop
    } // end return closure
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
          <CardContainer cardData={this.state.cardData} handleRedirect={this.props.handleRedirect}
            handleRemoveCard={this.props.user.auth === "admin" && this.handleRemoveSport} />
          {addDialog}
        </div>

        <LoadDialog loadDialogOpen={this.state.loadDialogOpen}/>
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
