import React, { Component } from 'react';
import { Button, Avatar, Chip } from '@material-ui/core';
import { Home,  Done} from '@material-ui/icons';

import AddCard from '../components/AddCard';
import AddDialog from '../components/AddDialog';
import CardContainer from '../containers/CardContainer';
import InputContainer from '../containers/InputContainer';
import LoadDialog from '../components/LoadDialog';

import { UNIVERSITY_LIST, STATUS_LIST } from '../config';

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
    this.dataRef = null;
    this.dataListener = null;
  }

  sportDbUpdate = () => {
    const self = this;

    if (this.dataRef && this.dataRef.off && this.dataListener) {
      this.dataRef.off('value', this.dataListener);
      this.dataListener = null;
    }

    if (!this.props.user) {
      return;
    }

    window.firebase.database().ref(`/years`).once('value').then(function(snapshot){
      let data = snapshot.val() ? snapshot.val() : {};
      Object.keys(data).map(k => {
        if(data[k].th === self.props.th)
          self.setState({isNCKUHost: data[k].ncku_host});
        return 0;
      })
      self.setState({isLoadingHost: true});

      self.dataRef = window.firebase.database().ref(`/sports/${self.props.th}`);
      self.dataListener = self.dataRef.on('value', function(snapshot) {
        self.updateSports(snapshot.val());
      });
      self.setState({
        addSportData: self.createAddSportData(self.state.addSportInfo)
      });
    });
  }

  componentDidMount = () => {
    this.sportDbUpdate();
  }

  componentDidUpdate = (prevProps) => {
    if (!this.props.user || prevProps.th !== this.props.th) {
      this.sportDbUpdate();
    }
  }

  componentWillUnmount = () => {
    if (this.dataRef && this.dataRef.off && this.dataListener) {
      this.dataRef.off('value', this.dataListener);
      this.dataListener = null;
    }
  }

  sportCardDataUpdate = (sportData, cardData, sportUid, index) => {
    let sport = sportData[sportUid];

    if (this.state.isNCKUHost && (this.props.user.auth === 'admin' || this.props.user.auth === 'overview')) {
      cardData.push({ order: 'order' in sport ? sport.order : +index + 1, title: sport.title, uid: sportUid, content: (
        <div>
          {UNIVERSITY_LIST.map(university => {
            let statusChip = <Chip label='尚未報名完成' />;
            if (sport.is_finish && university in sport.is_finish && sport.is_finish[university]) {
              statusChip =
                <Chip
                  style={{backgroundColor: "#c8e6c9", color: "#4caf50"}}
                  avatar={
                    <Avatar style={{color: "#fff", backgroundColor: "#4caf50"}}>
                      <Done />
                    </Avatar>
                  }
                  label='已報名完成'
                />;
            }
            return (
              <React.Fragment key={`btn_fragment_${university}`}>
                <Button
                  key={`btn_${university}`}
                  color='secondary'
                  style={{margin: 2}}
                  onClick={() => this.props.handleRedirect(`/?th=${this.props.th}&university=${university}&sport=${sportUid}`)}>
                  {university.toUpperCase()}
                </Button>
                {statusChip}
                <br />
              </React.Fragment>
            )
          })}
        </div>
      )});
      return 0;
    }

    if (!this.state.isNCKUHost && this.props.user.auth !== 'ncku' && this.props.user.auth !== 'admin' && this.props.user.auth !== 'overview') {
      return 0;
    }

    let university = "ncku";
    if (0 <= UNIVERSITY_LIST.indexOf(this.props.user.auth)) {
      university = this.props.user.auth;
    }
    if (sport.is_finish && university in sport.is_finish && sport.is_finish[university]) {
      let url = null;
      if (this.props.user.auth === "admin" || this.props.user.auth === "overview") {
        url = `/?th=${this.props.th}&university=${university}&sport=${sportUid}`;
      }
      cardData.push({
        order: 'order' in sport ? sport.order : +index + 1,
        title: sport.title,
        uid: sportUid,
        content: (
          <div style={{display: "inline-block"}}>
            <Chip
              style={{backgroundColor: "#c8e6c9", color: "#222"}}
              avatar={
                <Avatar style={{color: "#fff", backgroundColor: "#4caf50"}}>
                  <Done />
                </Avatar>
              }
              label='已報名完成'
            />
          </div>
        ),
        url: url});
    } else {
      cardData.push({ order: 'order' in sport ? sport.order : +index + 1, title: sport.title, uid: sportUid, content: (
          <div style={{display: "inline-block"}}>
            <Chip label='尚未報名完成' />
          </div>
        ), url: `/?th=${this.props.th}&university=${university}&sport=${sportUid}`});
    }

    return 0;
  }

  updateSports = (d) => {
    if(!this.state.isLoadingHost) {
      console.log("Wait loading host");
      setTimeout(() => this.updateSports(d), 1000);
      return ;
    }
    if (0 > ["ncku", "ccu", "nsysu", "nchu", 'admin', 'overview'].indexOf(this.props.user.auth)) {
      console.error(`${this.props.th}th can't get ${this.props.user.auth} data`);
      return;
    }
    let data = d ? d : {};
    let cardData = [];
    Object.keys(data).map(this.sportCardDataUpdate.bind(null, data, cardData));

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
      const sportUniversityList = this.state.isNCKUHost ? UNIVERSITY_LIST : ["ncku"];
      let sportUid = window.firebase.database().ref(`/sports/${th}/`).push().key;
      let updates = {
        [`/sports/${th}/${sportUid}`]: {title: title}
      }
      sportUniversityList.map(university => {
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

      const sportUniversityList = this.state.isNCKUHost ? UNIVERSITY_LIST : ["ncku"];
      for (let i = 0; i < sportUniversityList.length; ++i) {
        let university = sportUniversityList[i];
        window.firebase.database().ref(`/participants/${university}/${this.props.th}/${uid}`)
                .once('value').then(ptcShot => {
          let ptcs = ptcShot.val() ? ptcShot.val() : {};
          STATUS_LIST.map(status => {
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
          if(i === sportUniversityList.length - 1) // update at last
            window.firebase.database().ref().update(updates, (err) => err && console.error(err));
        }, err => err && console.error(err)) // end once ptcs
      } // end sportUniversityList for loop
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
          <Home />
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
