import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, Card, CardTitle, CardText, RaisedButton} from 'material-ui';
import {blue200, indigo200, red200} from 'material-ui/styles/colors';
import fileSaver from 'file-saver';
import {FileFileDownload} from 'material-ui/svg-icons';

import LoadDialog from '../components/LoadDialog';
import Input from '../components/Input';

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      sportData: [],
      participantShot: {},
      sportsShot: {},
      participantsShot: {},
      selectedSports: {},
      countDiffID: 0,
      countConflictPtc: 0,
      countSize: 0,
      countLodging: 0,
      countBus: 0,
      countVegetarian: 0,
      loadDialogOpen: true
    };
    this.updateDelay = null;
    this.updateSelectSport = {};
  }

  componentDidMount() {
    if(this.props.user){
      let self = this;
      this.dataRef = window.firebase.database().ref(`/participant/ncku/${this.props.th}`);
      this.dataRef.on('value', participantShot => {
        window.firebase.database().ref(`/sports/${this.props.th}`).once('value').then(sportsShot => {
          window.firebase.database().ref(`/participants/ncku/${this.props.th}`).once('value').then(participantsShot => {
            self.setState({
              participantShot: participantShot.val() ? participantShot.val() : {} ,
              sportsShot: sportsShot.val() ? sportsShot.val() : {},
              participantsShot: participantsShot.val() ? participantsShot.val() : {}
            })
            self.updateOverview();
          });
        });
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  getParticipantData = (data, sports, uid, memberName = "隊員") => {
    const statusName = {coach: "教練", captain: "領隊", manager: "管理", leader: "隊長", member: memberName};
    const keyList = ["id", "name", "sport", "status", "deptyear", "birthday", "size", "lodging", "bus", "vegetarian"];
    let d = data[uid];

    keyList.map(k => {
      if(typeof d[k] === "undefined") {
        if(k !== "lodging" && k !== "bus" && k !== "vegetarian") d[k] = "";
        else d[k] = false;
      }
      return 0;
    });

    let birthday = "";
    if(d.birthday !== "") {
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
      sport: sports[d.sport].title,
      status: statusName[d.status]
    }
  }

  updateOverview = () => {
    // need loading icon
    let data = this.state.participantShot;
    let sports = this.state.sportsShot;
    let participants = this.state.participantsShot;
    let tableData = [], sportData = [];
    const statusList = ["coach", "captain", "manager", "leader", "member"];
    let selectedSports = this.state.selectedSports;
    let isInitSelectd = Object.keys(selectedSports).length === 0 ? true : false;
    let diffID = {}, conflictPtc = {};
    let countSize = {}, countLodging = 0, countBus = 0, countVegetarian = 0;

    Object.keys(sports).map(sportUid => {
      // check if selected or init will select all
      if(isInitSelectd) selectedSports[sportUid] = true;
      else if(!(sportUid in selectedSports) || !selectedSports[sportUid]) return 0;

      let perSportData = {sport: "", contact: {}, data: []};
      perSportData.contact = participants[sportUid].contact ? participants[sportUid].contact : {};
      if(typeof perSportData.contact.name === "undefined") perSportData.contact.name = "";
      if(typeof perSportData.contact.phone === "undefined") perSportData.contact.phone = "";
      if(typeof perSportData.contact.email === "undefined") perSportData.contact.email = "";
      let memberName = Object.keys(participants[sportUid]).length === 2 ? "成員" : "隊員";
      statusList.map(s => {
        if(s in participants[sportUid]) {
          if(s === "member") {
            Object.keys(participants[sportUid][s]).map(participantUid => {
              perSportData.data.push(this.getParticipantData(data, sports, participantUid, memberName));
              return 0;
            });
          } else {
            perSportData.data.push(this.getParticipantData(data, sports, participants[sportUid][s]));
          }
        }
        return 0;
      });
      perSportData.sport = perSportData.data[0].sport;
      sportData.push(perSportData);
      return 0;
    });

    Object.keys(data).map(participantUid => {
      if(!(data[participantUid].sport in sports)) {
        console.error(participantUid + "'s sport not in sport");
        return 0
      };
      if(!selectedSports[data[participantUid].sport]) return 0; // if not select
      let curParticipant = this.getParticipantData(data, sports, participantUid); // will not contain undefined
      if(curParticipant.name + curParticipant.id === '') return 1;
      tableData.push(curParticipant);

      if(!(curParticipant.name + curParticipant.id in diffID)) {
        diffID[curParticipant.name + curParticipant.id] = {...curParticipant}
        if(curParticipant.size in countSize)
          countSize[curParticipant.size] ++;
        else if('size' in curParticipant && curParticipant.size !== '')
          countSize[curParticipant.size] = 1;
        if(curParticipant.lodging) countLodging ++;
        if(curParticipant.bus) countBus ++;
        if(curParticipant.vegetarian) countVegetarian ++;
      }
      else{
        Object.keys(curParticipant).map(k => {
          if(k !== "status" && k !== "sport")
            if(diffID[curParticipant.name + curParticipant.id][k] !== curParticipant[k]) { // need refine
              if(diffID[curParticipant.name + curParticipant.id][k] === '' || diffID[curParticipant.name + curParticipant.id][k] === false) {
                diffID[curParticipant.name + curParticipant.id][k] = curParticipant[k];
                if(k === 'size' && curParticipant[k] in countSize)
                  countSize[curParticipant[k]] ++;
                else if(k === 'size' && 'size' in curParticipant)
                  countSize[curParticipant[k]] = 1;
                if(k === 'lodging') countLodging ++;
                if(k === 'bus') countBus ++;
                if(k === 'vegetarian') countVegetarian ++;
              }
              conflictPtc[curParticipant.name + curParticipant.id] = true;
            }
          return 0;
        });
      }

      return 0;
    });

    tableData.sort((a, b) => {
      if(a.id === '' && b.id ==='')
        return a.name + a.id < b.name + b.id ? -1 : 1;
      return a.id < b.id ? -1 : 1;
    });
    let curColor = blue200, needChangeColor = false;
    for(let i = 0; i < tableData.length; ++i) {
      if(needChangeColor && i && tableData[i - 1].name + tableData[i - 1].id !== tableData[i].name + tableData[i].id) {
        curColor = curColor === blue200 ? indigo200 : blue200;
        needChangeColor = false;
      }
      if((!i && tableData[i].name + tableData[i].id === tableData[i + 1].name + tableData[i + 1].id) ||
        (i && tableData[i - 1].name + tableData[i - 1].id === tableData[i].name + tableData[i].id) ||
        (i !== tableData.length - 1  && tableData[i].name + tableData[i].id === tableData[i + 1].name + tableData[i + 1].id)) {
          //tableData[i].color = grey100;
          if(tableData[i].name + tableData[i].id in conflictPtc) tableData[i].bgcolor = red200;
          else {
            tableData[i].bgcolor = curColor;
            needChangeColor = true;
          }
      }
    }

    this.setState({ // need loading
      tableData: tableData,
      sportData: sportData,
      selectedSports: selectedSports,
      countDiffID: Object.keys(diffID).length,
      countConflictPtc: Object.keys(conflictPtc).length,
      countSize: countSize,
      countLodging: countLodging,
      countBus: countBus,
      countVegetarian: countVegetarian,
      loadDialogOpen: false
    });
  }

  handleExportData = () => {
    let outputString = "";
    this.state.sportData.map(s => {
      outputString += s.sport + "\n";
      outputString += ",姓名,電話,信箱\n";
      outputString += `聯絡人,${s.contact.name},${s.contact.phone},${s.contact.email}\n`;
      outputString += "身分,身分證字號,姓名,系級,生日,衣服尺寸,住宿,遊覽車,素食\n";
      s.data.map(d => {
        outputString += [
          d.status, d.id, d.name,
          d.deptyear, d.birthday, d.size,
          d.lodging ? 'V' : '',
          d.bus ? 'V' : '',
          d.vegetarian ? 'V' : ''
        ].join(',') + "\n";
        return 0;
      });
      outputString += "\n";
      return 0;
    });

    let curTime = new Date();
    let montZero = +curTime.getMonth() + 1 > 9 ? '' : '0';
    let dateZero = +curTime.getDate() > 9 ? '' : '0';
    fileSaver.saveAs(
      new Blob([outputString], {type: "text/plain;charset=utf-8"}),
      `${this.props.th}-${curTime.getFullYear()}_${montZero}${+curTime.getMonth() + 1}_${dateZero}${curTime.getDate()}-${curTime.getHours()}_${curTime.getMinutes()}_${curTime.getSeconds()}.csv`
    );
  }

  handleLoadDialogOpen = () => {
    this.setState({loadDialogOpen: true});
  }

  handleLoadDialogClose = () => {
    this.setState({loadDialogOpen: false});
  }

  handleSelectSport = d => {
    Object.assign(this.updateSelectSport, d);
    if(this.updateDelay) clearTimeout(this.updateDelay);
    this.updateDelay = setTimeout(() => {
      this.setState({loadDialogOpen: true}, () => {
        setTimeout(() => {
          this.setState(prevState => {
            Object.keys(this.updateSelectSport).map(sportID =>
                prevState.selectedSports[sportID] = this.updateSelectSport[sportID])
            return {selectedSports: prevState.selectedSports}
          }, () => {
            this.updateSelectSport = {};
            this.updateOverview();
          });
        }, 100);
      });
    }, 1500);
  }

  render() {
    let tableItems = this.state.tableData.map((d, index) => {
      return (
        <TableRow style={{color: d.color,backgroundColor: d.bgcolor}} key={`${d.id}_${index}`}>
          <TableRowColumn>{d.id}</TableRowColumn>
          <TableRowColumn>{d.name}</TableRowColumn>
          <TableRowColumn>{d.sport}</TableRowColumn>
          <TableRowColumn>{d.status}</TableRowColumn>
        </TableRow>
      )
    });

    let tableContainer = (
      <Table multiSelectable={true}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>身分證字號</TableHeaderColumn>
            <TableHeaderColumn>姓名</TableHeaderColumn>
            <TableHeaderColumn>項目</TableHeaderColumn>
            <TableHeaderColumn>身分</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableItems}
        </TableBody>
      </Table>
    )

    let sportContainer = (
      <div>
        {this.state.sportData.map((s, sIndex) => {
          return (
            <Card key={`Card_${sIndex}`} style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
              <CardTitle title={s.sport} subtitle={this.props.subtitle}  />
              <CardText>
                <Table multiSelectable={true}>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderColumn></TableHeaderColumn>
                      <TableHeaderColumn>姓名</TableHeaderColumn>
                      <TableHeaderColumn>電話</TableHeaderColumn>
                      <TableHeaderColumn>信箱</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableRowColumn>聯絡人</TableRowColumn>
                      <TableRowColumn>{s.contact.name}</TableRowColumn>
                      <TableRowColumn>{s.contact.phone}</TableRowColumn>
                      <TableRowColumn>{s.contact.email}</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table multiSelectable={true} style={{marginTop: "10px"}}>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderColumn>身分證字號</TableHeaderColumn>
                      <TableHeaderColumn>姓名</TableHeaderColumn>
                      <TableHeaderColumn>項目</TableHeaderColumn>
                      <TableHeaderColumn>身分</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {s.data.map((d, pIndex) => {
                      return (
                        <TableRow key={`Row_${pIndex}`}>
                          <TableRowColumn>{d.id}</TableRowColumn>
                          <TableRowColumn>{d.name}</TableRowColumn>
                          <TableRowColumn>{d.sport}</TableRowColumn>
                          <TableRowColumn>{d.status}</TableRowColumn>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardText>
            </Card>
          );
        })}
      </div>
    )

    let selectSports = (
      <div style={{textAlign: "left"}}>
        {
          Object.keys(this.state.selectedSports).map((sportID, index) => {
            return (<Input type="checkbox" key={`selectedSport_${index}`} name={sportID} text={this.state.sportsShot[sportID].title}
                      value={this.state.selectedSports[sportID]} handleInputUpdate={this.handleSelectSport} />);
          })
        }
      </div>
    )

    return (
      <div className="content" style={{textAlign: "center"}}>
        <RaisedButton
          onTouchTap={this.handleExportData}
          label="匯出"
          secondary={true}
          style={{margin: "12px"}}
          icon={<FileFileDownload />}
        />

        <div className="card-container" style={{maxWidth: "900px", margin: "auto"}}>
          <Card style={{width: "100%", margin: "10px", verticalAlign: "top"}}>
            <CardTitle title={(<div>項目顯示</div>)}  />
            <CardText>
              {selectSports}
            </CardText>
          </Card>

          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title={(<div>人數<br />(依姓名+身份證字號)</div>)}  />
            <CardText>
              {this.state.countDiffID}
            </CardText>
          </Card>
          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="資料有出入人數" />
            <CardText>
              {this.state.countConflictPtc}
            </CardText>
          </Card>
          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="衣服尺寸人數" />
            <CardText>
              {
                Object.keys(this.state.countSize).map((size, index) => {
                  return <div key={`${size}_${index}`}>{size}：{this.state.countSize[size]}</div>
                })
              }
            </CardText>
          </Card>
          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="住宿人數" />
            <CardText>
              {this.state.countLodging}
            </CardText>
          </Card>
          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="搭乘遊覽車人數" />
            <CardText>
              {this.state.countBus}
            </CardText>
          </Card>
          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="素食人數" />
            <CardText>
              {this.state.countVegetarian}
            </CardText>
          </Card>

          {sportContainer}

          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="總覽" />
            <CardText>
              {tableContainer}
            </CardText>
          </Card>
        </div>

        <LoadDialog loadDialogOpen={this.state.loadDialogOpen} />
      </div>
    )
  }
}

export default Overview;
