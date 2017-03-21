import React, { Component } from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, Card, CardTitle, CardText, RaisedButton} from 'material-ui';
import {blue200, indigo200, red200} from 'material-ui/styles/colors';
import fileSaver from 'file-saver';
import {FileFileDownload} from 'material-ui/svg-icons'

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      sportData: [],
      countDiffID: 0,
      countConflictPtc: 0,
      countVegetarian: 0,
      countSize: 0
    };
  }

  componentDidMount() {
    if(this.props.user){
      let self = this;
      this.dataRef = window.firebase.database().ref(`/participant/ncku/${this.props.th}`);
      window.firebase.database().ref(`/sports/${this.props.th}`).once('value').then(sportShot => {
        window.firebase.database().ref(`/participants/ncku/${this.props.th}`).once('value').then(participantsShot => {
          this.dataRef.on('value', participant => {
            self.updateOverview(participant.val(), sportShot.val(), participantsShot.val());
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

    if(d.birthday !== "") {
      d.birthday = new Date(d.birthday);
      d.birthday = `${d.birthday.getFullYear()}-${d.birthday.getMonth()}-${d.birthday.getDate()}`;
    }

    return {
      id: d.id,
      name: d.name,
      deptyear: d.deptyear,
      birthday: d.birthday,
      size: String(d.size).toUpperCase(),
      lodging: d.lodging,
      bus: d.bus,
      vegetarian: d.vegetarian,
      sport: sports[d.sport].title,
      status: statusName[d.status]
    }
  }

  updateOverview = (d, s, p) => {
    // need loading icon
    let data = d ? d : {};
    let sports = s ? s : {};
    let participants = p ? p : {};
    let tableData = [], sportData = [];
    const statusList = ["coach", "captain", "manager", "leader", "member"];
    let diffID = {}, conflictPtc = {};
    let countVegetarian = 0, countSize = {};

    Object.keys(sports).map(sportUid => {
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
      let curParticipant = this.getParticipantData(data, sports, participantUid);
      tableData.push(curParticipant);

      if(!(curParticipant.id in diffID)) {
        diffID[curParticipant.id] = {...curParticipant}
        if(curParticipant.vegetarian)
          countVegetarian ++;
        if(curParticipant.size in countSize)
          countSize[curParticipant.size] ++;
        else if(typeof curParticipant.size !== "undefined")
          countSize[curParticipant.size] = 1;
      }
      else{
        Object.keys(curParticipant).map(k => {
          if(k !== "status" && k !== "sport")
            if(diffID[curParticipant.id][k] !== curParticipant[k])
              conflictPtc[curParticipant.id] = true;
          return 0;
        });
      }

      return 0;
    });

    tableData.sort((a, b) => {return a.id < b.id ? -1 : 1});
    let curColor = blue200, needChangeColor = false;
    for(let i = 0; i < tableData.length; ++i) {
      if(needChangeColor && i && tableData[i - 1].id !== tableData[i].id) {
        curColor = curColor === blue200 ? indigo200 : blue200;
        needChangeColor = false;
      }
      if((!i && tableData[i].id === tableData[i + 1].id) ||
        (i && tableData[i - 1].id === tableData[i].id) ||
        (i !== tableData.length - 1  && tableData[i].id === tableData[i + 1].id)) {
          //tableData[i].color = grey100;
          if(tableData[i].id in conflictPtc) tableData[i].bgcolor = red200;
          else {
            tableData[i].bgcolor = curColor;
            needChangeColor = true;
          }
      }
    }

    this.setState({ // need loading
      tableData: tableData,
      sportData: sportData,
      countDiffID: Object.keys(diffID).length,
      countConflictPtc: Object.keys(conflictPtc).length,
      countVegetarian: countVegetarian,
      countSize: countSize
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
    fileSaver.saveAs(
      new Blob([outputString], {type: "text/plain;charset=utf-8"}),
      `${this.props.th}-${curTime.getFullYear()}_${curTime.getMonth()}_${curTime.getDate()}-${curTime.getHours()}_${curTime.getMinutes()}_${curTime.getSeconds()}.csv`
    );
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
          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="人數(依身份證字號)"  />
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
            <CardTitle title="素食人數" />
            <CardText>
              {this.state.countVegetarian}
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

          {sportContainer}

          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title="總覽" />
            <CardText>
              {tableContainer}
            </CardText>
          </Card>
        </div>
      </div>
    )
  }
}

export default Overview;
