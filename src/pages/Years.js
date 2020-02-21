import React, { Component } from 'react';
import { Divider } from '@material-ui/core';

import AddCard from '../components/AddCard';
import AddDialog from '../components/AddDialog';
import CardContainer from '../containers/CardContainer';
import InputContainer from '../containers/InputContainer';
import LoadDialog from '../components/LoadDialog';
import CardItem from '../components/CardItem';

import logo from '../assets/logo.png';

class Years extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: [],
      curYearData: {},
      addYearData: [],
      addYearInfo: {
        yearYear: '',
        yearTh: '',
        yearTitle: '',
        yearOrganizer: '',
        yearCoorganizer: '',
        yearImplementer: '',
        yearDate: '',
        yearVenue: '',
        yearContactName: '',
        yearContactPhone: '',
        yearContactEmail: '',
        yearNCKUHost: false
      },
      addDialogOpen: false,
      loadDialogOpen: true
    };

    this.dataRef = null;
    this.dataListener = null;
  }

  yearDbUpdate = () => {
    const self = this;

    if(this.dataRef && this.dataRef.off && this.dataListener){
      this.dataRef.off('value', this.dataListener);
      this.dataListener = null;
    }

    if (!this.props.user) {
      return;
    }

    this.dataRef = window.firebase.database().ref(`/years`);
    this.dataListener = this.dataRef.on('value', function(snapshot) {
      self.updateYears(snapshot.val());
    });
    this.setState({
      addYearData: this.createAddYearData(this.state.addYearInfo)
    });
  }

  componentDidMount() {
    this.yearDbUpdate();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.user || !prevProps.user || prevProps.user.uid !== this.props.user.uid) {
      this.yearDbUpdate();
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off && this.dataListener){
      this.dataRef.off('value', this.dataListener);
      this.dataListener = null;
    }
  }

  updateYears = (d) => {
    // need loading icon
    let data = d ? d : {};
    let cardData = [];
    let curYearData = {};

    Object.keys(data).map(k => {
      if (!data[k].ncku_host && this.props.user.auth !== 'ncku' && this.props.user.auth !== 'admin' && this.props.user.auth !== 'overview') {
        return 0;
      }

      if (`${new Date().getFullYear()}` === data[k].year) {
        curYearData = {
          title: data[k].title,
          url: `/?th=${data[k].th}`,
          content: (
            <div style={{textAlign: 'left', padding: '10px'}}>
              <table style={{border: '0px'}}>
                <tbody>
                  <tr style={{border: '0px', padding: '0px'}}>
                    <td style={{border: '0px', padding: '0px', width: '80px', verticalAlign: 'top'}}>活動地點: </td>
                    <td style={{border: '0px', padding: '0px'}}>{`${data[k].venue ? data[k].venue : ''}`}</td>
                  </tr>
                  <tr style={{border: '0px', padding: '0px'}}>
                    <td style={{border: '0px', padding: '0px', width: '80px', verticalAlign: 'top'}}>活動日期: </td>
                    <td style={{border: '0px', padding: '0px'}}>{`${data[k].date ? data[k].date : ''}`}</td>
                  </tr>
                  <tr style={{border: '0px', padding: '0px'}}>
                    <td style={{border: '0px', padding: '0px', width: '80px', verticalAlign: 'top'}}>主辦單位: </td>
                    <td style={{border: '0px', padding: '0px'}}>{`${data[k].organizer ? data[k].organizer : ''}`}</td>
                  </tr>
                  <tr style={{border: '0px', padding: '0px'}}>
                    <td style={{border: '0px', padding: '0px', width: '80px', verticalAlign: 'top'}}>協辦單位: </td>
                    <td style={{border: '0px', padding: '0px'}}>{data[k].coorganizer ? data[k].coorganizer.split('\n').map((s, sIdx) => <React.Fragment key={sIdx}>{s}<br/></React.Fragment>) : ''}</td>
                  </tr>
                  <tr style={{border: '0px', padding: '0px'}}>
                    <td style={{border: '0px', padding: '0px', width: '80px', verticalAlign: 'top'}}>主辦單位: </td>
                    <td style={{border: '0px', padding: '0px'}}>{data[k].implementer ? data[k].implementer.split('\n').map((s, sIdx) => <React.Fragment key={sIdx}>{s}<br/></React.Fragment>) : ''}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        };
        return 0;
      }

      cardData.push({
        title: data[k].title,
        url: `/?th=${data[k].th}`, content: (
        <div style={{textAlign: 'left', padding: '10px'}}>
          <table style={{border: '0px'}}>
            <tbody>
              <tr style={{border: '0px', padding: '0px'}}>
                <td style={{border: '0px', padding: '0px', width: '80px', verticalAlign: 'top'}}>活動地點: </td>
                <td style={{border: '0px', padding: '0px'}}>{`${data[k].venue ? data[k].venue : ''}`}</td>
              </tr>
              <tr style={{border: '0px', padding: '0px'}}>
                <td style={{border: '0px', padding: '0px', width: '80px', verticalAlign: 'top'}}>活動日期: </td>
                <td style={{border: '0px', padding: '0px'}}>{`${data[k].date ? data[k].date : ''}`}</td>
              </tr>
              <tr style={{border: '0px', padding: '0px'}}>
                <td style={{border: '0px', padding: '0px', width: '80px'}}>主辦單位: </td>
                <td style={{border: '0px', padding: '0px'}}>{`${data[k].organizer ? data[k].organizer : ''}`}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )});
      return 0;
    });

    this.setState({ // need loading
      cardData: cardData,
      curYearData: curYearData,
      loadDialogOpen: false
    });
  }

  createAddYearData = (addYearInfo) => {
    return [
      { type: "text", name: "yearYear", text: "西元年 ex:2017", value: addYearInfo.yearYear, disabled: false },
      { type: "text", name: "yearTh", text: "屆數 ex:12", value: addYearInfo.yearTh, disabled: false },
      { type: "text", name: "yearOrganizer", text: "主辦單位 ex:國立中山大學", value: addYearInfo.yearOrganizer, disabled: false },
      { type: "text", name: "yearCoorganizer", text: "協辦單位 ex:國立中正大學、國立中興大學、國立成功大學", value: addYearInfo.yearCoorganizer, disabled: false },
      { type: "text", name: "yearImplementer", text: "承辦單位 ex:國立中山大學學生事務處課指組、國立中山大學體育室", value: addYearInfo.yearImplementer, disabled: false },
      { type: "text", name: "yearTitle", text: "顯示名稱 ex:第12屆", value: addYearInfo.yearTitle, disabled: false },
      { type: "text", name: "yearDate", text: "活動日期 ex:106年5月20-21日", value: addYearInfo.yearDate, disabled: false },
      { type: "text", name: "yearVenue", text: "活動地點 ex:中山大學", value: addYearInfo.yearVenue, disabled: false },
      { type: "text", name: "yearContactName", text: "本屆負責人", value: addYearInfo.yearContactName, disabled: false },
      { type: "text", name: "yearContactPhone", text: "負責人電話", value: addYearInfo.yearContactPhone, disabled: false },
      { type: "text", name: "yearContactEmail", text: "負責人信箱", value: addYearInfo.yearContactEmail, disabled: false },
      { type: "checkbox", name: "yearNCKUHost", text: "成大主辦", value: addYearInfo.yearNCKUHost, disabled: false }
    ]
  }

  handleAddYearInfoUpdate = (d) => {
    this.setState(prevState => {
      let curAddYearInfo = Object.assign(prevState.addYearInfo, d);
      return {
        addYearInfo: curAddYearInfo,
        addYearData: this.createAddYearData(curAddYearInfo)
      };
    });
  }

  handleAddYear = () => { // pop screen
    if(this.props.user.auth === "admin") {
      let {yearYear, yearTh, yearOrganizer, yearCoorganizer, yearImplementer, yearTitle, yearDate, yearVenue,
            yearContactName, yearContactPhone, yearContactEmail, yearNCKUHost} = this.state.addYearInfo; // need check collision
      let yearUid = window.firebase.database().ref(`/years`).push().key;
      window.firebase.database().ref().update({
        [`/years/${yearUid}`]: {
          year: yearYear,
          th: yearTh,
          organizer: yearOrganizer,
          coorganizer: yearCoorganizer,
          implementer: yearImplementer,
          title: yearTitle,
          date: yearDate,
          venue: yearVenue,
          contact_name: yearContactName,
          contact_phone: yearContactPhone,
          contact_email: yearContactEmail,
          ncku_host: yearNCKUHost
        }
      }, (err) => {
        // will update by on
        if(err) console.log(err);
        this.handleAddDialogClose();
        this.setState(prevState => {
          let curAddYearInfo = {
                yearYear: '',
                yearTh: '',
                yearOrganizer: '',
                yearCoorganizer: '',
                yearImplementer: '',
                yearTitle: '',
                yearDate: '',
                yearVenue: '',
                yearContactName: '',
                yearContactPhone: '',
                yearContactEmail: '',
                yearNCKUHost: false
              };
          return {addYearInfo: curAddYearInfo, addYearData: this.createAddYearData(curAddYearInfo)};
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

  render() {
    let addCard = null;
    if(this.props.user.auth === "admin")
      addCard = <AddCard handlePlus1={this.handleAddDialogOpen} />;

    let addDialog = null;
    if(this.props.user.auth === "admin")
      addDialog =
        <AddDialog title="新增盃賽" addDialogOpen={this.state.addDialogOpen} handleAddSubmit={this.handleAddYear}
          handleAddDialogClose={this.handleAddDialogClose}
          content={<InputContainer inputData={this.state.addYearData} handleInputUpdate={this.handleAddYearInfoUpdate} />} />;

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <img src={logo} alt='logo' style={{width: '200px', margin: '10px'}} /><br />
          {addCard}
          {
            Object.entries(this.state.curYearData).length !== 0
            ? <CardItem {...this.state.curYearData} handleRedirect={this.props.handleRedirect} />
            : null
          }
          <Divider style={{margin: '50px'}} />
          <h2>過去活動</h2>
          <CardContainer cardData={this.state.cardData} handleRedirect={this.props.handleRedirect} />
          {addDialog}
        </div>
        <LoadDialog />
      </div>
    );

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default Years;
