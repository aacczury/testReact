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
        this.dataRef.on('value', function(snapshot) {
          self.updateOverview(snapshot.val(), sportShot.val());
        });
      })
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  updateOverview = (d, s) => {
    // need loading icon
    let data = d ? d : {};
    let sports = s ? s : {};
    let tableData = [];
    const statusName = {coach: "教練", manager: "管理", leader: "隊長", member: "隊員"};
    let diffID = {}, conflictPtc = {};
    let countVegetarian = 0, countSize = {XS: 0, S: 0, M: 0, L: 0, XL: 0};

    Object.keys(data).map(participantUid => {
      let {
        id, name, sport, status,
        deptyear, birthday, size, lodging, bus, vegetarian
      } = data[participantUid];

      if(!(id in diffID)) {
        diffID[id] = {...data[participantUid]}
        countVegetarian ++;
        if(String(size).toUpperCase() in countSize)
          countSize[String(size).toUpperCase()] ++;
        else console.log(`Error Size: ${size}`);
      }
      else{
        let pBirthday = new Date(diffID[id].birthday);
        let cBirthday = new Date(birthday);
        pBirthday = `${pBirthday.getFullYear()}-${pBirthday.getMonth()}-${pBirthday.getDate()}`
        cBirthday = `${cBirthday.getFullYear()}-${cBirthday.getMonth()}-${cBirthday.getDate()}`
        if(diffID[id].id !== id ||
          diffID[id].name !== name ||
          diffID[id].deptyear !== deptyear ||
          pBirthday !== cBirthday ||
          diffID[id].size !== size ||
          diffID[id].lodging !== lodging ||
          diffID[id].bus !== bus ||
          diffID[id].vegetarian !== vegetarian)
          conflictPtc[id] = true;
      }

      tableData.push({
        id: id,
        name: name,
        deptyear: deptyear,
        birthday: birthday,
        size: size,
        lodging: lodging,
        bus: bus,
        vegetarian: vegetarian,
        sport: sports[sport].title,
        status: statusName[status]
      })
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
      countDiffID: Object.keys(diffID).length,
      countConflictPtc: Object.keys(conflictPtc).length,
      countVegetarian: countVegetarian,
      countSize: countSize
    });
  }

  handleExportData = () => {
    let outputString = "身分證字號,姓名,系級,生日,衣服尺寸,住宿,遊覽車,素食,項目,身分\n";
    this.state.tableData.map(d => {
      let ymdBirthday = typeof d.birthday === "undefined" ? '' : new Date(d.birthday);
      if(ymdBirthday !== "") ymdBirthday = `${ymdBirthday.getFullYear()}-${ymdBirthday.getMonth()}-${ymdBirthday.getDate()}`
      outputString += [
        typeof d.id === "undefined" ? '' : d.id,
        typeof d.name === "undefined" ? '' : d.name,
        typeof d.deptyear === "undefined" ? '' : d.deptyear,
        ymdBirthday,
        typeof d.size === "undefined" ? '' : String(d.size).toUpperCase(),
        d.lodging ? 'V' : '',
        d.bus ? 'V' : '',
        d.vegetarian ? 'V' : '',
        d.sport,
        d.status
      ].join(',') + "\n";
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
      <Table>
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
          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title={this.props.title} subtitle={this.props.subtitle}  />
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
