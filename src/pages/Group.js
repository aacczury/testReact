import React, { Component } from 'react';
import { Card, CardTitle, CardText, RaisedButton } from 'material-ui';
//import {blue200, indigo200, red200} from 'material-ui/styles/colors';
//import {FileFileDownload} from 'material-ui/svg-icons';

import AddDialog from '../components/AddDialog';
import LoadDialog from '../components/LoadDialog';
import Input from '../components/Input';

import '../components/ResTable.css';

class Group extends Component {
  constructor(props) {
    super(props);

    this.state = {
      participantShot: {},
      sportsShot: {},
      participantsShot: {},
      refineData: {},
      selectedAttr: {
        bus: false,
        lodging: false,
        vegetarian: false
      },
      addDistText: '',
      distData: [],
      loadDialogOpen: true,
      addDistDialogOpen: false,
      addMemberDialogOpen: false
    };
  }

  componentDidMount() {
    if (this.props.user && (this.props.user.auth === 'admin' || this.props.user.auth === 'overview')) {
      let self = this;
      this.dataRef = window.firebase.database().ref(`/participant/${this.props.university}/${this.props.th}`);
      this.dataRef.on('value', participantShot => {
        window.firebase.database().ref(`/sports/${this.props.th}`).once('value').then(sportsShot => {
          window.firebase.database().ref(`/participants/ncku/${this.props.th}`).once('value').then(participantsShot => {
            self.setState({
              participantShot: participantShot.val() ? participantShot.val() : {},
              sportsShot: sportsShot.val() ? sportsShot.val() : {},
              participantsShot: participantsShot.val() ? participantsShot.val() : {}
            }, () => self.updateGroup());
          });
        });
      });
    }
  }

  componentWillUnmount() {
    if (this.dataRef && this.dataRef.off) {
      this.dataRef.off();
    }
  }


  getPtcData = (d, sport, memberName = "隊員") => {
    const statusName = { coach: "教練", captain: "領隊", manager: "管理", leader: "隊長", member: memberName };
    const keyList = ["id", "name", "sport", "status", "deptyear", "birthday", "size", "lodging", "bus", "vegetarian"];

    keyList.map(k => {
      if (typeof d[k] === "undefined") {
        if (k !== "lodging" && k !== "bus" && k !== "vegetarian") d[k] = "";
        else d[k] = false;
      }
      return 0;
    });

    let birthday = "";
    if (d.birthday !== "") {
      birthday = new Date(d.birthday);
      let monthZero = +birthday.getMonth() + 1 > 9 ? '' : '0';
      let dateZero = +birthday.getDate() > 9 ? '' : '0';
      birthday = `${birthday.getFullYear()}-${monthZero}${+birthday.getMonth() + 1}-${dateZero}${birthday.getDate()}`;
    }

    return {
      id: d.id,
      name: d.name,
      deptyear: d.deptyear,
      birthday: birthday,
      size: String(d.size).toUpperCase(),
      lodging: d.lodging,
      bus: d.bus,
      vegetarian: d.vegetarian,
      sport: sport.title,
      status: statusName[d.status]
    }
  }

  updateGroup = () => {
    let refineData = {};
    let { participantShot, sportsShot } = this.state;

    Object.keys(participantShot).map(participantUid => {
      if (!(participantShot[participantUid].sport in sportsShot)) {
        console.error(participantUid + "'s sport not in sports");
        return 1
      };

      // will not contain undefined
      let curParticipant =
        this.getPtcData(participantShot[participantUid], sportsShot[participantShot[participantUid].sport]);
      if (curParticipant.name + curParticipant.id === '') return 0;

      if (!(curParticipant.name + curParticipant.id in refineData)) {
        refineData[curParticipant.name + curParticipant.id] = { ...curParticipant }
      }
      else {
        Object.keys(curParticipant).map(k => {
          if (k !== "status" && k !== "sport") {
            if (refineData[curParticipant.name + curParticipant.id][k] === '' ||
              refineData[curParticipant.name + curParticipant.id][k] === false) {
              refineData[curParticipant.name + curParticipant.id][k] = curParticipant[k];
            }
          }
          return 0;
        });
      }

      return 0;
    });

    this.setState({
      refineData: refineData,
      loadDialogOpen: false
    })
  }

  handleSelectAttr = (d) => {
    this.setState(prevState => {
      Object.assign(prevState.selectedAttr, d)
      return { selectedSports: prevState.selectedAttr }
    });
  }

  handleAddDist = () => {
    this.setState(prevState => {
      prevState.distData.push({ title: this.state.addDistText });
      return {
        distData: prevState.distData,
        addDistText: ''
      }
    }, () => this.handleAddDistDialogClose());
  }

  handleUpdateAddDist = (d) => {
    this.setState({ addDistText: d.text });
  }

  handleLoadDialogOpen = () => {
    this.setState({ loadDialogOpen: true });
  }

  handleLoadDialogClose = () => {
    this.setState({ loadDialogOpen: false });
  }

  handleAddDistDialogOpen = () => {
    this.setState({ addDistDialogOpen: true })
  }

  handleAddDistDialogClose = () => {
    this.setState({ addDistDialogOpen: false })
  }

  handleAddMemberDialogOpen = () => {
    this.setState({ addMemberDialogOpen: true })
  }

  handleAddMemberDialogClose = () => {
    this.setState({ addMemberDialogOpen: false })
  }

  render() {

    return (
      <div className="content" style={{ textAlign: "center" }}>
        <Card style={{ width: "300px", display: "inline-block", margin: "10px", verticalAlign: "top" }}>
          <CardTitle title="選擇屬性 (多選則表示且 e.g. 有住宿且吃素的人，未選則為全部人)" />
          <CardText>
            <Input style={{ display: "inline-block" }} type="checkbox" name="bus" text="搭乘遊覽車"
              value={this.state.selectedAttr.bus} handleInputUpdate={this.handleSelectAttr} />
            <Input type="checkbox" name="" text="住宿"
              value={this.state.selectedAttr.lodging} handleInputUpdate={this.handleSelectAttr} />
            <Input type="checkbox" name="bus" text="素食"
              value={this.state.selectedAttr.vegetarian} handleInputUpdate={this.handleSelectAttr} />
          </CardText>
        </Card>

        <div>
          <RaisedButton
            onTouchTap={this.handleAddDistDialogOpen}
            label="新增區分"
            secondary={true}
            style={{ margin: "12px" }}
          />
        </div>

        <div className="card-container" style={{ maxWidth: "900px", margin: "auto" }}>
          {
            this.state.distData.map((d, index) => {
              return (
                <Card key={`distCard_${index}`} style={{ width: "100%", margin: "10px", verticalAlign: "top" }}>
                  <CardTitle title={(<div>{d.title}</div>)} />
                  <CardText>
                    <RaisedButton
                      onTouchTap={this.handleAddMemberDialogOpen}
                      label="新增成員"
                      secondary={true}
                      style={{ margin: "12px" }}
                    />
                  </CardText>
                </Card>
              )
            })
          }
        </div>

        <AddDialog title="新增區分" addDialogOpen={this.state.addDistDialogOpen} handleAddSubmit={this.handleAddDist}
          handleAddDialogOpen={this.handleAddDistDialogOpen} handleAddDialogClose={this.handleAddDistDialogClose}
          content={<Input type="text" name="text" text="區分 e.g. 07:00或1車等"
            value={this.state.addDistText} handleInputUpdate={this.handleUpdateAddDist} />} />

        <AddDialog title="新增成員" addDialogOpen={this.state.addMemberDialogOpen} handleAddSubmit={this.handleAddMember}
          handleAddDialogOpen={this.handleAddMemberDialogOpen} handleAddDialogClose={this.handleAddMemberDialogClose}
          content={<Input type="text" name="text" text="區分 e.g. 07:00或1車等"
            value={this.state.addMemberText} handleInputUpdate={this.handleUpdateAddMember} />} />

        <LoadDialog loadDialogOpen={this.state.loadDialogOpen} />
      </div>
    )
  }
}

export default Group;