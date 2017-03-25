import React, { Component } from 'react';
import {ActionHome, ImageExposurePlus1} from 'material-ui/svg-icons';
import {Card, CardTitle, CardText, IconButton, RaisedButton} from 'material-ui';

import ParticipantInfo from '../components/ParticipantInfo';
import Input from '../components/Input';
import AddDialog from '../components/AddDialog';

import '../components/ResTable.css';

class Participants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      participantsData: [],
      contact: {
        name: "",
        phone: "",
        email: ""
      },
      sportData: {},
      sendEmailDialogOpen: false
    };
    this.tmpUpload = {};
    this.uploadTimer = null;

    this.dataRef = window.firebase.database().ref(`/participants/${this.props.university}/${this.props.th}/${this.props.sport}`);
    this.tmpRemove = {};
  }

  beforeunload = () => {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
    this.removeParticipant();
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.beforeunload);
    if(this.props.user){ // need varify
      let self = this;
      window.firebase.database().ref(`/sports/${this.props.th}/${this.props.sport}`).once('value').then(sportShot => {
        self.dataListener = self.dataRef.on('value', function(snapshot) {
          self.updateParticipants(snapshot.val(), sportShot.val());
        });
      });
    }
  }

  componentWillReceiveProps = (nextProps) => {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.th !== this.props.th || nextProps.sport !== this.props.sport || nextProps.university !== this.props.university) {
      this.dataRef.off('value', this.dataListener);
      this.dataRef = window.firebase.database().ref(`/participants/${nextProps.university}/${nextProps.th}/${nextProps.sport}`);
      let self = this;
      this.dataListener = this.dataRef.on('value', function(snapshot) {
        self.updateParticipants(snapshot.val());
      }, err => {
        console.log(err);
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.beforeunload);
    this.beforeunload();
  }

  updateParticipants = (d, s) => {
    const statusName = {captain: "領隊", coach: "教練", leader: "隊長", manager:"管理", member: "隊員"};
    const statusList = ["coach", "captain", "manager", "leader", "member"];
    // need loading icon
    let data = d ? d : {};
    let sportData = s ? s : {};
    let tableData = [], participantsData = [];
    statusList.map((status, index) => {
      if(status !== "member" && status in data && data[status]) {
        tableData.push(<ParticipantInfo key={`ptc_high_${index}`} user={this.props.user}
          university={this.props.university} th={this.props.th} uid={data[status]} status={statusName[status]} />)
        participantsData.push({
          uid: data[status],
          status: statusName[status]
        })
      }
      return 0;
    });

    let memberName = tableData.length === 0 ? "成員" : "隊員";

    if(data.member) {
      Object.keys(data.member).map((uid, index) => {
        if(this.props.user.auth === "admin")
          tableData.push(<ParticipantInfo key={`ptc_member_${index}`} user={this.props.user} university={this.props.university} th={this.props.th} uid={uid}
            status={memberName} handleRemoveParticipantInfo={this.handleRemoveParticipantInfo(uid)} />);
        else
          tableData.push(<ParticipantInfo key={`ptc_member_${index}`} user={this.props.user} university={this.props.university} th={this.props.th} uid={uid}
            status={memberName} />);
        participantsData.push({
          uid: uid,
          status: memberName
        })
        return 0;
      });
    }

    this.setState({ // need loading
      tableData: tableData,
      participantsData: participantsData,
      contact: data.contact,
      sportData: sportData
    });
  }

  removeParticipant = () => {
    if(Object.keys(this.tmpRemove).length > 0)
      window.firebase.database().ref().update(
        Object.keys(this.tmpRemove).reduce((p, c) => {
          if(this.tmpRemove[c])
            p[`/participant/${this.props.university}/${this.props.th}/${c}`] = null;
          return p;
        }, {}), (err) => {
        if(err) console.log(err);
      });
  }

  handleAddParticipantInfo = () => {
    let uid = window.firebase.database().ref(`/participant/${this.props.university}/${this.props.th}/`).push().key;
    window.firebase.database().ref().update({
      [`/participant/${this.props.university}/${this.props.th}/${uid}`]: {status: "member", sport: this.props.sport},
      [`/participants/${this.props.university}/${this.props.th}/${this.props.sport}/member/${uid}`]: true
    }, (err) => {
      // will update by on
      if(err) console.log(err);
    });
  }

  handleRemoveParticipantInfo = (uid, isRemove = true) => {
    return () => {
      window.firebase.database().ref().update({
        [`/participants/${this.props.university}/${this.props.th}/${this.props.sport}/member/${uid}`] : isRemove ? null : true
      }, (err) => { // can add redo
        this.tmpRemove = Object.assign(this.tmpRemove, {[uid]: isRemove});
      });
    }
  }

  uploadContact = (d) => {
    if(this.props.user && this.props.th && this.props.university && this.props.sport && this.dataRef){ // need varify
      let self = this;
      this.dataRef.child('contact').update(this.tmpUpload, (err) => {
        self.tmpUpload = {};
      });
    }
  }

  handleContactUpdate = d => {
    this.setState(prevState => {
      let curContact = Object.assign(prevState.contact, d);
      return {
        contact: curContact
      };
    });
    this.tmpUpload = Object.assign(this.tmpUpload, d);
    if(this.uploadTimer) clearTimeout(this.uploadTimer);
    this.uploadTimer = setTimeout(() => this.uploadContact(this.tmpUpload), 3000);
  }

  getParticipantData = (data) => {
    const keyList = ["name", "deptyear", "id", "birthday", "size", "lodging", "bus", "vegetarian"];
    let d = data ? data : {};

    keyList.map(k => {
      if(typeof d[k] === "undefined") {
        if(k === "lodging" || k === "bus" || k === "vegetarian") d[k] = false;
        else d[k] = "";
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
      lodging: d.lodging ? 'V' : '',
      bus: d.bus ? 'V' : '',
      vegetarian: d.vegetarian ? 'V' : ''
    }
  }

  handleSendEmail = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://stud.adm.ncku.edu.tw/act/chcwcup/register/mail.asp", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    let title = encodeURI(`[第${this.props.th}屆正興城灣盃]+${this.state.sportData.title}+報名資料`);
    let body = `
    <div style="font-family:sans-serif,微軟正黑體;">
      ${this.state.contact.name} 您好：<br /><br />
      歡迎使用第${this.props.th}屆正興城灣盃報名系統，<br />
      您被設定為<span style="color:#2196f3">${this.state.sportData.title}</span>的聯絡人，<br />
      <span style="color:#2196f3">${this.state.sportData.title}</span>的報名資料如下：<br /><br />`;
    body += `
      <table style='font-family:sans-serif,微軟正黑體;border-collapse:collapse;border:1px solid #888;'>
        <tr style='border:1px solid #888;font-weight:900px;'>
          <th style='font-family:sans-serif,微軟正黑體;padding:5px;color:#fff;background-color:#00bcd4;'></th>
          <th style='font-family:sans-serif,微軟正黑體;padding:5px;color:#fff;background-color:#00bcd4;'>姓名</th>
          <th style='font-family:sans-serif,微軟正黑體;padding:5px;color:#fff;background-color:#00bcd4;'>電話</th>
          <th style='font-family:sans-serif,微軟正黑體;padding:5px;color:#fff;background-color:#00bcd4;'>信箱</th>
        </tr>
        <tr style='border:1px solid #888;'>
          <td style='font-family:sans-serif,微軟正黑體;padding:5px;'>聯絡人</td>
          <td style='font-family:sans-serif,微軟正黑體;padding:5px;'>${this.state.contact.name}</td>
          <td style='font-family:sans-serif,微軟正黑體;padding:5px;'>${this.state.contact.phone}</td>
          <td style='font-family:sans-serif,微軟正黑體;padding:5px;'>${this.state.contact.email}</td>
        </tr>
      </table><br /><br />`;

    const attrList = ["status", "name", "deptyear", "id", "birthday", "size", "lodging", "bus", "vegetarian"];
    const attrName = {
      status: "身分", name: "姓名", deptyear: "系級", id: "身分證字號",
      birthday: "出生年月日", size: "衣服尺寸", lodging: "住宿", bus: "搭乘遊覽車", vegetarian: "素食"}

    body += `
      <table style='font-family:sans-serif,微軟正黑體;border-collapse:collapse;border:1px solid #888;'>
        <tr style='border:1px solid #888;font-weight:900px;'>`;
    attrList.map(attr => {
      body += `<th style='font-family:sans-serif,微軟正黑體;padding:5px;color:#fff;background-color:#00bcd4;'>${attrName[attr]}</th>`;
      return 0;
    })
    body += `</tr>`;

    for(let i = 0; i < this.state.participantsData.length; ++i) {
      let ptc = this.state.participantsData[i];
      let self = this;
      window.firebase.database().ref(`/participant/${this.props.university}/${this.props.th}/${ptc.uid}`).once('value').then(ptcInfoShot => {
        let ptcInfo = self.getParticipantData(ptcInfoShot.val() ? ptcInfoShot.val() : {});
        body += `<tr style='border:1px solid #888;'>
                  <td style='font-family:sans-serif,微軟正黑體;padding:5px;'>${ptc.status}</td>`;
        attrList.map(attr => {
          if(attr !== "status") {
            body += `<td style='font-family:sans-serif,微軟正黑體;padding:5px;'>${ptcInfo[attr]}</td>`;
          }
          return 0;
        })
        body += `</tr>`;
        if(i === this.state.participantsData.length - 1) {
          body += `</table><br />`;
          body += `因資料已送出，無法再於系統修改，<br />
                    如仍有需修改的資料或任何報名上的疑問，<br />
                    煩請聯絡本屆正興城灣盃負責人：<br />
                    惠姿，09XXXXXXXX，XXX@XXX.XXX<br />
                    <br />
                    謝謝，<br />
                    正興城灣盃籌備團隊敬上<br />
                    </div>
                    `

          body = encodeURI(body);
          xhr.send(`uid=${this.props.user.uid}&email=${this.state.contact.email}&title=${title}&body=${body}`);

          self.handleSendEmailDialogClose();
        }
      }, err => err && console.log(err));
    }
  }

  handleSendEmailDialogOpen = () => {
    this.setState({sendEmailDialogOpen: true})
  }

  handleSendEmailDialogClose = () => {
    this.setState({sendEmailDialogOpen: false})
  }


  render() {
    let cancelHeadCell = (<th></th>);

    let plus1 = null;
    if(this.props.user.auth === "admin")
      plus1 = (
        <tr>
          <td colSpan="10">
            {<IconButton>
              <ImageExposurePlus1 onTouchTap={this.handleAddParticipantInfo} />
            </IconButton>}
          </td>
        </tr>
      );

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <div><ActionHome /></div>
          <div>
            <Card style={{display: "inline-block"}}>
              <CardText>
                <table>
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>姓名</th>
                      <th>電話</th>
                      <th>信箱</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td style={{fontWeight: "900", fontSize: "16px"}}>聯絡人</td>
                      <td data-label="姓名">
                        <Input type="text" name="name" value={this.state.contact.name} handleInputUpdate={this.handleContactUpdate} />
                      </td>
                      <td data-label="電話">
                        <Input type="text" name="phone" value={this.state.contact.phone} handleInputUpdate={this.handleContactUpdate} />
                      </td>
                      <td data-label="信箱">
                        <Input type="text" name="email" value={this.state.contact.email} handleInputUpdate={this.handleContactUpdate} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardText>
            </Card>
          </div>

          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardTitle title={this.props.title} subtitle={this.props.subtitle}  />
            <CardText>
              <table>
                <thead>
                  <tr>
                    {cancelHeadCell}
                    <th>身分</th>
                    <th>姓名</th>
                    <th>系級</th>
                    <th>身分證字號</th>
                    <th>出生年月日</th>
                    <th>衣服尺寸</th>
                    <th>住宿</th>
                    <th>搭乘遊覽車</th>
                    <th>素食</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.tableData}
                  {plus1}
                </tbody>
              </table>
            </CardText>
          </Card>

          <div>
            <RaisedButton
              onTouchTap={this.handleSendEmailDialogOpen}
              label="送出"
              secondary={true}
              style={{margin: "12px"}}
            />
          </div>
        </div>

        <AddDialog title="確認送出" addDialogOpen={this.state.sendEmailDialogOpen} handleAddSubmit={this.handleSendEmail}
          handleAddDialogOpen={this.handleSendEmailDialogOpen} handleAddDialogClose={this.handleSendEmailDialogClose}
          content={<div>送出後將無法再做修改，<br />並會將此報名資料寄送給聯絡人。</div>} />

      </div>
    );

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default Participants;
