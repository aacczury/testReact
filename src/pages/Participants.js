import React, { Component } from 'react';
import {ActionHome, ImageExposurePlus1} from 'material-ui/svg-icons';
import {Card, CardText, IconButton, RaisedButton, Snackbar} from 'material-ui';

import {highStatusList, statusName, attrList, attrType, attrName} from '../config';
import ParticipantInfo from '../components/ParticipantInfo';
import Input from '../components/Input';
import AddDialog from '../components/AddDialog';
import LoadDialog from '../components/LoadDialog';

import '../components/ResTable.css';

class Participants extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ptcsData: {},
      tableData: [],
      highStatusForm: [],
      contact: {
        name: "",
        phone: "",
        email: ""
      },
      errorPtc : {},
      errorContact: {},
      participantsData: {},
      yearData: {},
      sportData: {},
      sendEmailDialogOpen: false,
      errorAlertOpen: false,
      loadDialogOpen: true
    };

    this.dataRef = window.firebase.database().ref(`/participants/${this.props.university}/${this.props.th}/${this.props.sport}`);
  }

  componentDidMount = () => {
    if(this.props.user){ // need varify
      let self = this;
      window.firebase.database().ref(`/years`).once('value').then(yearShort => {
        window.firebase.database().ref(`/sports/${this.props.th}/${this.props.sport}`).once('value').then(sportShot => {
          self.dataListener = self.dataRef.on('value', function(snapshot) {
            self.updateParticipants(snapshot.val(), sportShot.val(), yearShort.val());
          }, err => err && console.error(err));
        }, err => err && console.error(err));
      }, err => err && console.error(err));
    }
  }

  componentWillReceiveProps = (nextProps) => {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.th !== this.props.th || nextProps.sport !== this.props.sport || nextProps.university !== this.props.university) {
      this.dataRef.off('value', this.dataListener);
      this.dataRef = window.firebase.database().ref(`/participants/${nextProps.university}/${nextProps.th}/${nextProps.sport}`);
      let self = this;
      window.firebase.database().ref(`/years`).once('value').then(yearShort => {
        window.firebase.database().ref(`/sports/${nextProps.th}/${nextProps.sport}`).once('value').then(sportShot => {
          self.dataListener = self.dataRef.on('value', function(snapshot) {
            self.updateParticipants(snapshot.val(), sportShot.val(), yearShort.val());
          }, err => err && console.error(err));
        }, err => err && console.error(err));
      }, err => err && console.error(err));
    }
  }

  componentWillUnmount = () => {
  }

  updateParticipants = (d, s, y, e = {}) => {
    let data = d ? d : {};
    let sportData = s ? s : {};
    let yearData = y ? y : {};
    let errorPtc = e;
    let highStatusForm = [];
    let tableData = [];
    highStatusList.map((status, index) => {
      if(status in data && data[status]) {
        highStatusForm.push(<ParticipantInfo key={`ptc_high_${index}`} user={this.props.user}
          university={this.props.university} th={this.props.th} uid={data[status]} status={statusName[status]}
          handleUpdatePtcInfo={this.handleUpdatePtcInfo} errorPtc={errorPtc[data[status]]} />)
      }
      return 0;
    });

    if ('leader' in data && data["leader"]) {
      let status = "leader"
      tableData.push(<ParticipantInfo key={`ptc_${status}`} user={this.props.user}
        university={this.props.university} th={this.props.th} uid={data[status]} status={statusName[status]}
        handleUpdatePtcInfo={this.handleUpdatePtcInfo} errorPtc={errorPtc[data[status]]} />)
    }

    let memberName = tableData.length === 0 ? "成員" : "隊員";
    if('member' in data) {
      Object.keys(data.member).map((uid, index) => {
        if(this.props.user.auth === "admin")
          tableData.push(<ParticipantInfo key={`ptc_member_${index}`} user={this.props.user} university={this.props.university}
            th={this.props.th} uid={uid} status={memberName}
            handleUpdatePtcInfo={this.handleUpdatePtcInfo} errorPtc={errorPtc[uid]}
            handleRemoveParticipantInfo={this.handleRemoveParticipantInfo(uid)} />);
        else
          tableData.push(<ParticipantInfo key={`ptc_member_${index}`} user={this.props.user} university={this.props.university}
            th={this.props.th} uid={uid} status={memberName}
            handleUpdatePtcInfo={this.handleUpdatePtcInfo} errorPtc={errorPtc[uid]} />);
        return 0;
      });
    }

    this.setState({ // need loading
      highStatusForm: highStatusForm,
      tableData: tableData,
      contact: data.contact,
      participantsData: data,
      sportData: sportData,
      yearData: yearData,
      errorPtc: errorPtc,
      loadDialogOpen: false
    });
  }

  handleAddParticipantInfo = () => {
    let uid = window.firebase.database().ref(`/participant/${this.props.university}/${this.props.th}/`).push().key;
    window.firebase.database().ref().update({
      [`/participant/${this.props.university}/${this.props.th}/${uid}`]: {status: "member", sport: this.props.sport},
      [`/participants/${this.props.university}/${this.props.th}/${this.props.sport}/member/${uid}`]: true
    }, err => err && console.error(err));
  }

  handleRemoveParticipantInfo = (uid) => {
    return () => {
      window.firebase.database().ref().update({
        [`/participants/${this.props.university}/${this.props.th}/${this.props.sport}/member/${uid}`] : null,
        [`/participant/${this.props.university}/${this.props.th}/${uid}`] : null
      }, err => {
        if(err) console.error(err);
        else this.setState(prevState => {
          if(uid in prevState.ptcsData) {
            delete prevState.ptcsData[uid];
            return {ptcsData: prevState.ptcsData};
          } else console.error(uid + " not in delete ptcsData!!!");
        })
      });
    }
  }

  uploadData = (callback) => {
    let updates = {};
    Object.keys(this.state.contact).map(attr => {
      updates[`/participants/${this.props.university}/${this.props.th}/${this.props.sport}/contact/${attr}`] = this.state.contact[attr];
      return 0;
    });

    Object.keys(this.state.ptcsData).map(uid => {
      let ptcInfo = this.state.ptcsData[uid];
      Object.keys(ptcInfo).map(attr => {
        updates[`/participant/${this.props.university}/${this.props.th}/${uid}/${attr}`] = ptcInfo[attr];
        return 0;
      });
      return 0;
    });

    updates[`/sports/${this.props.th}/${this.props.sport}/is_finish/${this.props.university}`] = true;

    window.firebase.database().ref().update(updates, err => {
      if (err) console.error(err);
      else callback && callback();
    });
  }

  handleUnlock = () => {
    let updates = {};
    updates[`/sports/${this.props.th}/${this.props.sport}/is_finish/${this.props.university}`] = false;
    window.firebase.database().ref().update(updates, err => {
      if (err) console.error(err);
      else this.setState(prevState => {
        if('sportData' in prevState && 'is_finish' in prevState.sportData && this.props.university in prevState.sportData.is_finish) {
          prevState.sportData.is_finish[this.props.university] = false;
          return {sportData: prevState.sportData};
        }
      })
    });
  }

  handleContactUpdate = d => {
    this.setState(prevState => {
      let curContact = Object.assign(prevState.contact, d);
      return { contact: curContact, errorContact: {} };
    });
  }

  handleUpdatePtcInfo = (d) => {
    this.setState(prevState => {
      return { ptcsData: Object.assign(prevState.ptcsData, d) };
    });
  }

  checkData = () => {
    /* check contact */
    const checkContactAttrList = ["name", "phone", "email"];
    let errorContact = {};
    let contact = this.state.contact;
    for(let i = 0; i < checkContactAttrList.length; ++i) {
      let attr = checkContactAttrList[i];
      if(attr in contact) {
        if(contact[attr] === "") {
          errorContact[attr] = "不可為空";
          break;
        }
        if(attr === "phone") {
          let match = contact[attr].match(/09\d{8}/);
          if(!match || match[0] !== contact[attr]) {
            errorContact[attr] = "格式錯誤，請輸入十位數字手機號碼";
            break;
          }
        }
        if(attr === "email") {
          /* ref: http://emailregex.com/ */
          let match = contact[attr].match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
          if(!match || match[0] !== contact[attr]) {
            errorContact[attr] = "信箱格式錯誤";
            break;
          }
        }
      } else {
        console.error(attr + " not in contact!!!");
      }
    }
    if(Object.keys(errorContact).length > 0) {
      this.setState({errorContact: errorContact});
      if(Object.keys(this.state.errorPtc).length > 0)
        this.updateParticipants(this.state.participantsData, this.state.sportData, this.state.yearData, {});
      this.handleSendEmailDialogClose();
      return 1;
    }

    /* check participants */
    const checkAttrList = ["name", "deptyear", "id", "birthday", "size"];
    let ptcsUids = Object.keys(this.state.ptcsData);
    let errorPtc = {};
    for(let i = 0; i < ptcsUids.length; ++i) {
      let uid = ptcsUids[i];
      let ptc = this.state.ptcsData[uid];

      errorPtc[uid] = {};

      for(let j = 0; j < checkAttrList.length; ++j) {
        let attr = checkAttrList[j];

        if(attr === "birthday" && ptc[attr] !== "") {
          if(isNaN(+new Date(ptc[attr]))) {
            errorPtc[uid][attr] = "出生年月日錯誤";
            break;
          }

          let match = ptc[attr].match(/\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/);
          if (!match || match[0] !== ptc[attr]) {
            errorPtc[uid][attr] = "請輸入西元年-月-日，例：1991-01-01";
            break;
          }
        }
      }

      if(Object.keys(errorPtc[uid]).length > 0) {
        this.updateParticipants(this.state.participantsData, this.state.sportData, this.state.yearData, errorPtc);
        this.handleSendEmailDialogClose();
        return 1;
      }
    }
    return 0;
  }

  getParticipantData = (data) => {
    let d = data ? data : {};

    let ptcData = {};
    attrList.map(attr => {
      if(typeof d[attr] === 'undefined') {
        ptcData[attr] = attrType[attr] === 'checkbox' ? false : '';
      } else ptcData[attr] = d[attr];

      if (attrType[attr] === 'checkbox') ptcData[attr] = ptcData[attr] ? 'V' : '';
      if (attr === 'size') ptcData[attr] = ptcData[attr].toUpperCase();
      if (attr === 'birthday' && ptcData[attr] !== '') {
        let birthday = new Date(ptcData[attr]);
        if(isNaN(+birthday)) {
          console.error(birthday + " is not birthday!!!");
          return 1;
        }
        let monthZero = +birthday.getMonth() + 1 > 9 ? '' : '0';
        let dateZero = +birthday.getDate() > 9 ? '' : '0';
        ptcData[attr] = `${birthday.getFullYear()}-${monthZero}${+birthday.getMonth() + 1}-${dateZero}${birthday.getDate()}`;
      }
      return 0;
    });

    return ptcData;
  }

  sendEmail = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://stud.adm.ncku.edu.tw/act/chcwcup/register/mail.asp", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    let title = encodeURI(`[第${this.props.th}屆正興城灣盃]+${this.state.sportData.title}+報名資料`);

    let tableStyle = `'font-family:sans-serif,微軟正黑體;border-collapse:collapse;border:1px solid #aaa;'`;
    let trStyle = `'border:1px solid #aaa;'`;
    let thStyle = `'font-family:sans-serif,微軟正黑體;padding:5px;color:#fff;background-color:#00bcd4;font-weight:900'`;
    let tdStyle = `'font-family:sans-serif,微軟正黑體;padding:5px;'`;

    let body = `
    <div style="font-family:sans-serif,微軟正黑體;">
      ${this.state.contact.name} 您好：<br /><br />
      歡迎使用第${this.props.th}屆正興城灣盃報名系統，<br />
      您被設定為<span style="color:#2196f3">${this.state.sportData.title}</span>的聯絡人，<br />
      <span style="color:#2196f3">${this.state.sportData.title}</span>的報名資料如下：<br /><br />`;
    body += `
      <table style=${tableStyle}>
        <tr style=${trStyle}>
          <th style=${thStyle}></th>
          <th style=${thStyle}>姓名</th>
          <th style=${thStyle}>電話</th>
          <th style=${thStyle}>信箱</th>
        </tr>
        <tr style=${trStyle}>
          <td style=${tdStyle}>聯絡人</td>
          <td style=${tdStyle}>${this.state.contact.name}</td>
          <td style=${tdStyle}>${this.state.contact.phone}</td>
          <td style=${tdStyle}>${this.state.contact.email}</td>
        </tr>
      </table><br /><br />`;

      body += `
      <table style=${tableStyle}>
        <tr>
          <th style=${thStyle}>身分</th>
          <th style=${thStyle}>姓名</th>
        </tr>`;
      let isHighLevel = false;
      highStatusList.map(status => {
        if(status in this.state.participantsData) {
          isHighLevel = true;
          let uid = this.state.participantsData[status];
          if(uid in this.state.ptcsData) {
            let ptcInfo = this.getParticipantData(this.state.ptcsData[uid]);
            body += `<tr style=${trStyle}>
                      <td style=${tdStyle}>${statusName[status]}</td>
                      <td style=${tdStyle}>${ptcInfo.name}</td>
                    </tr>`;
          } else {
            console.error(uid + " not in high ptcsData!!!");
          }
        }
        return 0;
      });
    body += `</table><br />`;

    const mailAttrList = ['status'].concat(attrList);
    body += `
      <table style=${tableStyle}>
        <tr style=${trStyle}>`;
    mailAttrList.map(attr => {
      body += `<th style=${thStyle}>${attrName[attr]}</th>`;
      return 0;
    })
    body += `</tr>`;

    if ("leader" in this.state.participantsData && this.state.participantsData["leader"]) {
      let status = "leader"
      let uid = this.state.participantsData[status];
      if(uid in this.state.ptcsData) {
        let ptcInfo = this.getParticipantData(this.state.ptcsData[uid]);
        body += `<tr style=${trStyle}>
                  <td style=${tdStyle}>${statusName[status]}</td>`;
        attrList.map(attr => {
          if(attr !== "status") {
            body += `<td style=${tdStyle}>${ptcInfo[attr]}</td>`;
          }
          return 0;
        });
        body += `</tr>`;
      }
    }

    let memberName = isHighLevel ? "隊員" : "成員";
    let memberUids = 'member' in this.state.participantsData ?
                        Object.keys(this.state.participantsData["member"]) :
                        [];
    memberUids.map(uid => {
      if(uid in this.state.ptcsData) {
        let ptcInfo = this.getParticipantData(this.state.ptcsData[uid]);
        body += `<tr style=${trStyle}>
                  <td style=${tdStyle}>${memberName}</td>`;
        attrList.map(attr => {
          if(attr !== "status") {
            body += `<td style=${tdStyle}>${ptcInfo[attr]}</td>`;
          }
          return 0;
        });
        body += `</tr>`;
      } else {
        console.error(uid + " not in member ptcsData!!!");
      }
      return 0;
    });

    body += `</table><br />`;

    let yearUids = Object.keys(this.state.yearData);
    let year = {};
    yearUids.map(uid => {
        if("th" in this.state.yearData[uid] && this.state.yearData[uid].th === this.props.th)
          year = this.state.yearData[uid];
        return 0;
    });
    body += `因資料已送出，無法再於系統修改，<br />
              如仍有需修改的資料或任何報名上的疑問，<br />
              煩請聯絡：<br />`;
    if ("contact" in year) {
      Object.values(year.contact).map(contactInfo => {
        console.log(contactInfo)
        body += `<br />
        <div style="color:#2196F3">
          ${contactInfo.title ? contactInfo.title : ""} ${contactInfo.name ? contactInfo.name : ""}<br />
          ${contactInfo.phone ? "電話: " + contactInfo.phone + "<br />" : ""}
          ${contactInfo.email ? "信箱: " + contactInfo.email + "<br />" : ""}
        </div>`
        return 0;
      });
    } else {
      body += `<div style="color:#2196F3">
        ${year.contact_name ? year.contact_name + "<br />" : ""}
        ${year.contact_phone ? year.contact_phone + "<br />" : ""}
        ${year.contact_email ? year.contact_email + "<br />" : ""}
      </div>`
    }
    body += `<br />
              感謝您的填寫<br />
              正興城灣盃籌備團隊 敬上<br />
              </div>
              `
    body = encodeURI(body);
    xhr.send(`uid=${this.props.user.uid}&email=${this.state.contact.email}&title=${title}&body=${body}`);
  }

  handleSubmit = () => {
    this.handleLoadDialogOpen();
    if(this.checkData()){
      this.handleErrorAlertOpen();
      this.handleLoadDialogClose();
      return;
    }
    /* send email */
    this.sendEmail();
    /* upload */
    this.uploadData(() => {
      this.handleSendEmailDialogClose();
      this.handleLoadDialogClose();
      this.props.handleRedirect(`/?th=${this.props.th}`);
    });
  }

  handleSendEmailDialogOpen = () => {
    this.setState({sendEmailDialogOpen: true})
  }

  handleSendEmailDialogClose = () => {
    this.setState({sendEmailDialogOpen: false})
  }

  handleErrorAlertOpen = () => {
    this.setState({errorAlertOpen: true})
  }

  handleErrorAlertClose = () => {
    this.setState({errorAlertOpen: false})
  }

  handleLoadDialogOpen = () => {
    this.setState({loadDialogOpen: true});
  }

  handleLoadDialogClose = () => {
    this.setState({loadDialogOpen: false});
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

    let contactDOM = (
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
                    <Input type="text" name="name" value={this.state.contact.name} handleInputUpdate={this.handleContactUpdate}
                      errorText={this.state.errorContact.name} />
                  </td>
                  <td data-label="電話">
                    <Input type="text" name="phone" value={this.state.contact.phone} handleInputUpdate={this.handleContactUpdate}
                      errorText={this.state.errorContact.phone} />
                  </td>
                  <td data-label="信箱">
                    <Input type="email" name="email" value={this.state.contact.email} handleInputUpdate={this.handleContactUpdate}
                      errorText={this.state.errorContact.email} />
                  </td>
                </tr>
              </tbody>
            </table>
          </CardText>
        </Card>
      </div>
    )

    let highStatusDOM = null;
    if (this.state.highStatusForm.length > 0) {
      highStatusDOM = (
        <div>
          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardText>
              <table>
                <thead>
                  <tr>
                    {cancelHeadCell}
                    <th>身分</th>
                    <th>姓名</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.highStatusForm}
                </tbody>
              </table>
            </CardText>
          </Card>
        </div>
      )
    }

    let ptcInfoDOM = (
      <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
        <CardText>
          <table>
            <thead>
              <tr>
                {cancelHeadCell}
                <th>身分</th>
                <th>姓名</th>
                <th>系級</th>
                <th>身分證字號</th>
                <th>出生年月日 (例: 1991-01-01)</th>
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
    )

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <div><ActionHome /></div>
          { this.props.user.auth === "admin" && this.state.sportData.is_finish && this.state.sportData.is_finish[this.props.university]
             && this.state.sportData.is_finish[this.props.university] === true ?
            (<div>
              <RaisedButton
                onTouchTap={this.handleUnlock}
                label="解鎖"
                secondary={true}
                style={{margin: "12px"}}
              />
            </div>) :
            null
          }
          <h3 style={{textAlign: "center"}}>{this.state.sportData.title ? this.state.sportData.title : ''}</h3>

          {contactDOM}
          {highStatusDOM}
          {ptcInfoDOM}

          <div>
            <RaisedButton
              onTouchTap={this.handleSendEmailDialogOpen}
              label="送出"
              secondary={true}
              style={{margin: "12px"}}
            />
          </div>
        </div>

        <AddDialog title="確認送出" addDialogOpen={this.state.sendEmailDialogOpen} handleAddSubmit={this.handleSubmit}
          handleAddDialogOpen={this.handleSendEmailDialogOpen} handleAddDialogClose={this.handleSendEmailDialogClose}
          content={<div>送出後將無法再做修改，<br />並會將此報名資料寄送給聯絡人。</div>} />

        <Snackbar
          open={this.state.errorAlertOpen}
          message="資料有錯誤或缺漏"
          autoHideDuration={4000}
          onRequestClose={this.handleErrorAlertClose}
          bodyStyle={{backgroundColor: "#F44336"}}
        />

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

export default Participants;
