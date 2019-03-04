import React, { Component } from 'react';
import { Card, CardContent, IconButton, Button, Snackbar, SnackbarContent } from '@material-ui/core';
import { ExposurePlus1, Close } from '@material-ui/icons';

import { STATUS_HIGH_LIST, STATUS_NAME, ATTR_LIST, ATTR_FEW_LIST, ATTR_TYPE, ATTR_NAME } from '../config';
import ParticipantInfo from '../components/ParticipantInfo';
import Input from '../components/Input';
import AddDialog from '../components/AddDialog';
import LoadDialog from '../components/LoadDialog';
import SendPtcEmail from '../utils/SendPtcEmail'

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
      loadDialogOpen: true,
      isNCKUHost: false
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

  yearFind = (yearData, th) => {
    let yearUids = Object.keys(yearData);
    let year = {};

    yearUids.map(uid => {
        if("th" in yearData[uid] && th === yearData[uid].th) {
          year = yearData[uid];
        }
        return 0;
    });

    return year;
  }

  updateParticipants = (d, s, y, e = {}) => {
    let data = d ? d : {};
    let sportData = s ? s : {};
    let yearData = y ? y : {};
    let errorPtc = e;
    let highStatusForm = [];
    let tableData = [];
    let isNCKUHost = false;

    const year = this.yearFind(y, this.props.th);
    if ('ncku_host' in year && year.ncku_host) {
      isNCKUHost = true;
    }

    if (!isNCKUHost && this.props.user.auth !== 'ncku' && this.props.user.auth !== 'admin' && this.props.user.auth !== 'overview') {
      console.error(`${this.props.th}th can't get ${this.props.user.auth} data`);
      return 1;
    }

    STATUS_HIGH_LIST.map((status, index) => {
      if(status in data && data[status]) {
        highStatusForm.push(<ParticipantInfo key={`ptc_high_${index}`} user={this.props.user}
          university={this.props.university} th={this.props.th} uid={data[status]} status={STATUS_NAME[status]}
          handleUpdatePtcInfo={this.handleUpdatePtcInfo} errorPtc={errorPtc[data[status]]} />)
      }
      return 0;
    });

    if ('leader' in data && data["leader"]) {
      let status = "leader"
      tableData.push(<ParticipantInfo key={`ptc_${status}`} user={this.props.user}
        university={this.props.university} th={this.props.th} uid={data[status]} status={STATUS_NAME[status]}
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
      contact: data.contact ? data.contact : {name: "", phone: "", email: ""},
      participantsData: data,
      sportData: sportData,
      yearData: yearData,
      errorPtc: errorPtc,
      loadDialogOpen: false,
      isNCKUHost: isNCKUHost,
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
          /* remove \[ in character set: https://regexr.com/ Within a character set, only \, -, and ] need to be escaped. */
          let match = contact[attr].match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
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
    let checkAttrList = ["name", "deptyear", "id", "birthday", "size"];
    if (this.props.university) {
      checkAttrList = ['name', 'size'];
    }
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
    let ptcAttrList = 'ncku' === this.props.university ? ATTR_LIST : ATTR_FEW_LIST;
    if ('ncku' !== this.props.university) {
      ptcAttrList = ATTR_FEW_LIST;
    }

    let ptcData = {};
    ptcAttrList.map(attr => {
      if(typeof d[attr] === 'undefined') {
        ptcData[attr] = ATTR_TYPE[attr] === 'checkbox' ? false : '';
      } else ptcData[attr] = d[attr];

      if (ATTR_TYPE[attr] === 'checkbox') ptcData[attr] = ptcData[attr] ? 'V' : '';
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

  handleSubmit = () => {
    this.handleLoadDialogOpen();
    if(this.checkData()){
      this.handleErrorAlertOpen();
      this.handleLoadDialogClose();
      return;
    }
    /* send email */
    SendPtcEmail(this.props, this.state, this.getParticipantData, this.yearFind);
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
    if (!this.state.isNCKUHost && this.props.user.auth !== 'ncku' && this.props.user.auth !== 'admin' && this.props.user.auth !== 'overview') {
      return <React.Fragment></React.Fragment>;
    }

    let cancelHeadCell = (<th></th>);

    let plus1 = null;
    if(this.props.user.auth === "admin")
      plus1 = (
        <tr>
          <td colSpan="10">
            {<IconButton>
              <ExposurePlus1 onClick={this.handleAddParticipantInfo} />
            </IconButton>}
          </td>
        </tr>
      );

    let contactDOM = (
      <div>
        <Card style={{display: "inline-block"}}>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    )

    let highStatusDOM = null;
    if (this.state.highStatusForm.length > 0) {
      highStatusDOM = (
        <div>
          <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      )
    }

    let ptcInfoAttrList = ['status'].concat(ATTR_LIST);
    if ('ncku' !== this.props.university) {
      ptcInfoAttrList = ['status'].concat(ATTR_FEW_LIST);
    }
    let ptcInfoDOM = (
      <Card style={{margin: "10px", display: "inline-block", verticalAlign: "top"}}>
        <CardContent>
          <table>
            <thead>
              <tr>
                {cancelHeadCell}
                {
                  ptcInfoAttrList.map(attr => <th key={`ptcInfo_th_${attr}`}>{ATTR_NAME[attr]}</th>)
                }
              </tr>
            </thead>
            <tbody>
              {this.state.tableData}
              {plus1}
            </tbody>
          </table>
        </CardContent>
      </Card>
    )

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          { this.props.user.auth === "admin" && this.state.sportData.is_finish && this.state.sportData.is_finish[this.props.university]
             && this.state.sportData.is_finish[this.props.university] === true ?
            (<div>
              <Button variant="contained" onClick={this.handleUnlock} color="secondary" style={{margin: "12px"}}>
                解鎖
              </Button>
            </div>) :
            null
          }
          <h3 style={{textAlign: "center"}}>{this.state.sportData.title ? this.state.sportData.title : ''}</h3>

          {contactDOM}
          {highStatusDOM}
          {ptcInfoDOM}

          <div>
            <Button variant="contained" onClick={this.handleSendEmailDialogOpen} color="secondary" style={{margin: "12px"}}>
              送出
            </Button>
          </div>
        </div>

        <AddDialog title="確認送出" addDialogOpen={this.state.sendEmailDialogOpen} handleAddSubmit={this.handleSubmit}
          handleAddDialogOpen={this.handleSendEmailDialogOpen} handleAddDialogClose={this.handleSendEmailDialogClose}
          content={<div>送出後將無法再做修改，<br />並會將此報名資料寄送給聯絡人。</div>} />

        <Snackbar
          open={this.state.errorAlertOpen}
          autoHideDuration={4000}
          onClose={this.handleErrorAlertClose}
        >
          <SnackbarContent
            style={{backgroundColor: "#F44336"}}
            message="資料有錯誤或缺漏"
            action={[
              <IconButton
                key="close"
                color="inherit"
                onClick={this.handleErrorAlertClose}
              >
                <Close />
              </IconButton>,
            ]}
          / >
        </Snackbar>

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
