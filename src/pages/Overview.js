import React, { Component } from 'react';
import { Card, CardHeader, CardContent, Button } from '@material-ui/core';
import { blue, indigo, red } from '@material-ui/core/colors';
import { CloudDownload } from '@material-ui/icons';
import fileSaver from 'file-saver';

import LoadDialog from '../components/LoadDialog';
import Input from '../components/Input';

import '../components/ResTable.css';
import { STATUS_HIGH_LIST, STATUS_NAME, UNIVERSITY_LIST, ATTR_CHECK_LIST, ATTR_NAME } from '../config';
import YearFind from '../utils/YearFind';

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
    this.dataRef = null;
    this.keyList = [];
    this.isNckuHost = false;
  }

  dbUpdate = () => {
    const self = this;

    if (this.dataRef && this.dataRef.off) {
      this.dataRef.off();
    }

    if (!this.props.user) {
      return;
    }

    if (0 > UNIVERSITY_LIST.indexOf(this.props.university)) {
      return;
    }

    this.dataRef = window.firebase.database().ref(`/participant/${this.props.university}/${this.props.th}`);
    this.dataRef.on('value', participantShot => {
      window.firebase.database().ref(`/years`).once('value').then(yearsShot => {
        window.firebase.database().ref(`/sports/${this.props.th}`).once('value').then(sportsShot => {
          window.firebase.database().ref(`/participants/${this.props.university}/${this.props.th}`).once('value').then(participantsShot => {
            self.updateOverview(
              true,
              participantShot.val() ? participantShot.val() : {},
              yearsShot.val() ? yearsShot.val() : {},
              sportsShot.val() ? sportsShot.val() : {},
              participantsShot.val() ? participantsShot.val() : {}
            );
          });
        });
      });
    });
  }

  componentDidMount() {
    this.dbUpdate();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.user || prevProps.th !== this.props.th || prevProps.university !== this.props.university) {
      this.dbUpdate();
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  getParticipantData = (data, sports, uid, memberName = "隊員") => {
    const statusName = {coach: "教練", captain: "領隊", manager: "管理", leader: "隊長", member: memberName};
    let d = data[uid];

    this.keyList.map(k => {
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

  updateOverview = (isInit, participantShot, yearsShot, sportsShot, participantsShot) => {
    // need loading icon
    let data = participantShot ? participantShot : this.state.participantShot;
    let sports = sportsShot ? sportsShot : this.state.sportsShot;
    const years = yearsShot ? yearsShot : this.state.yearsShot;
    let participants = participantsShot ? participantsShot : this.state.participantsShot;
    let tableData = [], sportData = [];
    const statusList = ["leader", "member"];
    let selectedSports = isInit ? {} : this.state.selectedSports;
    let diffID = {}, conflictPtc = {};
    let countSize = {}, countLodging = 0, countBus = 0, countVegetarian = 0;

    const y = YearFind(years, this.props.th);
    this.isNckuHost = y.ncku_host ? true : false;
    this.keyList = ["id", "name", "sport", "status", "deptyear", "birthday", "size", "lodging", "bus", "vegetarian"];
    if ('ncku' !== this.props.university) {
      this.keyList = ["name", "sport", "status"];
    } else if (this.isNckuHost) {
      this.keyList = ["name", "sport", "status", "deptyear", "birthday", "size"]
    }

    Object.keys(sports).map(sportUid => {
      // check if selected or init will select all
      if(isInit) selectedSports[sportUid] = true;
      else if(!(sportUid in selectedSports) || !selectedSports[sportUid]) return 0;

      let perSportData = {sport: "", contact: {}, highStatusData: [], data: []};
      perSportData.contact = participants[sportUid].contact ? participants[sportUid].contact : {};
      if(typeof perSportData.contact.name === "undefined") perSportData.contact.name = "";
      if(typeof perSportData.contact.phone === "undefined") perSportData.contact.phone = "";
      if(typeof perSportData.contact.email === "undefined") perSportData.contact.email = "";
      STATUS_HIGH_LIST.map(s => {
        if(s in participants[sportUid]) {
          let d = data[participants[sportUid][s]]
          perSportData.highStatusData.push({
            "name": typeof d.name === "undefined" ? "" : d.name,
            "status": typeof d.status === "undefined" ? "" : STATUS_NAME[d.status]
          });
        }
        return 0;
      })
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
      if (0 <= STATUS_HIGH_LIST.indexOf(data[participantUid].status)) { // high status didn't need calculate
        return 0;
      }
      let curParticipant = this.getParticipantData(data, sports, participantUid); // will not contain undefined
      ['name', 'id', 'size'].map(attr => {
        curParticipant[attr] = curParticipant[attr] ? curParticipant[attr] : "";
        curParticipant[attr] = curParticipant[attr].trim().replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)});
        return 0;
      })
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
    let curColor = blue[200], needChangeColor = false;
    for(let i = 0; i < tableData.length; ++i) {
      if(needChangeColor && i && tableData[i - 1].name + tableData[i - 1].id !== tableData[i].name + tableData[i].id) {
        curColor = curColor === blue[200] ? indigo[200] : blue[200];
        needChangeColor = false;
      }
      if ((!i && tableData[i + 1] && tableData[i].name + tableData[i].id === tableData[i + 1].name + tableData[i + 1].id) ||
        (i && tableData[i - 1].name + tableData[i - 1].id === tableData[i].name + tableData[i].id) ||
        (i !== tableData.length - 1  && tableData[i].name + tableData[i].id === tableData[i + 1].name + tableData[i + 1].id)) {
          //tableData[i].color = grey100;
          if(tableData[i].name + tableData[i].id in conflictPtc) tableData[i].bgcolor = red[200];
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
      loadDialogOpen: false,
      participantShot: participantShot ? participantShot : this.state.participantShot,
      yearsShot: years ? years : this.state.yearsShot,
      sportsShot: sportsShot ? sportsShot : this.state.sportsShot,
      participantsShot: participantsShot ? participantsShot : this.state.participantsShot,
    });
  }

  handleExportData = () => {
    let outputString = "";
    this.state.sportData.map(s => {
      outputString += s.sport + "\n";
      outputString += ",姓名,電話,信箱\n";
      outputString += `聯絡人,${s.contact.name},${s.contact.phone},${s.contact.email}\n`;
      this.keyList.map((attr, attrIdx) => {
        if (!attrIdx) {
          outputString += ATTR_NAME[attr];
        } else {
          outputString += `,${ATTR_NAME[attr]}`;
        }
        return 0;
      })
      outputString += "\n";
      s.data.map(d => {
        this.keyList.map((attr, attrIdx) => {
          let value = d[attr];
          if (0 <= ATTR_CHECK_LIST.indexOf(attr)) {
            value = value ? 'V' : '';
          }
          if (!attrIdx) {
            outputString += value;
          } else {
            outputString += `,${value}`;
          }
          return 0;
        })
        outputString += "\n";
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

  handleSelectSport = d => {
    if(this.updateDelay) clearTimeout(this.updateDelay);
    this.updateDelay = setTimeout(() => {
      this.setState({loadDialogOpen: true});
      setTimeout(() => this.updateOverview(false), 100)
    }, 1500);
    this.setState(prevState => ({
      selectedSports: {
        ...prevState.selectedSports,
        ...d
      }
    }));
  }

  render() {
    let tableItems = this.state.tableData.map((d, index) => {
      return (
        <tr style={{color: d.color,backgroundColor: d.bgcolor}} key={`tr_${index}_${d.id}`}>
          {
            this.keyList.map(attr => {
              let value = d[attr];
              if (0 <= ATTR_CHECK_LIST.indexOf(attr)) {
                value = value ? 'V' : '';
              }
              return <td data-label={ATTR_NAME[attr]} key={`td_ptc${index}_${attr}`}>{value}</td>
            })
          }
        </tr>
      )
    });

    let tableContainer = (
      <table>
        <thead>
          <tr>
            {
              this.keyList.map(attr => <th key={`th_${attr}`}>{ATTR_NAME[attr]}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {tableItems}
        </tbody>
      </table>
    )

    let sportContainer = (
      <div>
        {this.state.sportData.map((s, sIndex) => {
          return (
            <Card key={`Card_${sIndex}`} style={{margin: "10px", display: "block", verticalAlign: "top"}}>
              <CardHeader title={s.sport} subheader={this.props.subtitle}  />
              <CardContent>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>姓名</th>
                      <th>電話</th>
                      <th>信箱</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{fontWeight: "900", fontSize: "16px"}}>聯絡人</td>
                      <td data-label="姓名">{s.contact.name}</td>
                      <td data-label="電話">{s.contact.phone}</td>
                      <td data-label="信箱">{s.contact.email}</td>
                    </tr>
                  </tbody>
                </table>
                <table>
                  <thead>
                    <tr>
                      <th>姓名</th>
                      <th>身分</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.highStatusData.map((d, pIndex) => {
                      return (
                        <tr key={`tr_highStatus_${d.status}_${pIndex}`}>
                          <td data-label="姓名">{d.name}</td>
                          <td data-label="身分">{d.status}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <table>
                  <thead>
                    <tr>
                      {
                        this.keyList.map(attr => <th key={`th_sport${sIndex}_${attr}`}>{ATTR_NAME[attr]}</th>)
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {s.data.map((d, pIndex) => {
                      return (
                        <tr key={`tr_${pIndex}_${d.id}`}>
                          {
                            this.keyList.map(attr => {
                              let value = d[attr];
                              if (0 <= ATTR_CHECK_LIST.indexOf(attr)) {
                                value = value ? 'V' : '';
                              }
                              return <td data-label={ATTR_NAME[attr]} key={`th_ptc${pIndex}_${attr}`}>{value}</td>
                            })
                          }
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
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
        <Button variant="contained" onClick={this.handleExportData} color='secondary' style={{margin: "12px"}}>
          <CloudDownload style={{marginRight: 10}} />
          匯出
        </Button>

        <div className="card-container" style={{maxWidth: "900px", margin: "auto"}}>
          <Card style={{width: "100%", margin: "10px", verticalAlign: "top"}}>
            <CardHeader title={(<div>項目顯示</div>)}  />
            <CardContent>
              {selectSports}
            </CardContent>
          </Card>

          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardHeader title={(<div>人數<br />(依姓名+(身份證字號))</div>)}  />
            <CardContent>
              {this.state.countDiffID}
            </CardContent>
          </Card>
          <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardHeader title="資料有出入人數" />
            <CardContent>
              {this.state.countConflictPtc}
            </CardContent>
          </Card>
          {
            'ncku' === this.props.university ? (
              <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
                <CardHeader title="衣服尺寸人數" />
                <CardContent>
                  {
                    Object.keys(this.state.countSize).map((size, index) => {
                      return <div key={`${size}_${index}`}>{size}：{this.state.countSize[size]}</div>
                    })
                  }
                </CardContent>
              </Card>
            ) : null
          }
          {
            'ncku' === this.props.university && !this.isNckuHost ? (
              <React.Fragment>
                <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
                  <CardHeader title="住宿人數" />
                  <CardContent>
                    {this.state.countLodging}
                  </CardContent>
                </Card>
                <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
                  <CardHeader title="搭乘遊覽車人數" />
                  <CardContent>
                    {this.state.countBus}
                  </CardContent>
                </Card>
                <Card style={{width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
                  <CardHeader title="素食人數" />
                  <CardContent>
                    {this.state.countVegetarian}
                  </CardContent>
                </Card>
              </React.Fragment>
            ) : null
          }

          {sportContainer}

          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardHeader title="總覽" />
            <CardContent>
              {tableContainer}
            </CardContent>
          </Card>
        </div>

        <LoadDialog loadDialogOpen={this.state.loadDialogOpen} />
      </div>
    )
  }
}

export default Overview;
