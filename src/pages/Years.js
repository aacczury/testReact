import React, { Component } from 'react';
import { Home } from '@material-ui/icons';

import AddCard from '../components/AddCard';
import AddDialog from '../components/AddDialog';
import CardContainer from '../containers/CardContainer';
import InputContainer from '../containers/InputContainer';
import LoadDialog from '../components/LoadDialog';

class Years extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: [],
      addYearData: [],
      addYearInfo: {
        yearYear: '',
        yearTh: '',
        yearTitle: '',
        yearOrganizer: '',
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
  }

  componentDidMount() {
    if(this.props.user){
      let self = this;
      this.dataRef = window.firebase.database().ref(`/years`);
      this.dataRef.on('value', function(snapshot) {
        self.updateYears(snapshot.val());
      });
      this.setState({
        addYearData: this.createAddYearData(this.state.addYearInfo)
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  updateYears = (d) => {
    // need loading icon
    let data = d ? d : {};
    let cardData = [];
    Object.keys(data).map(k => {
      cardData.push({
        title: data[k].title,
        url: `/?th=${data[k].th}`, content: (
        <div>
          {`活動地點: ${data[k].venue ? data[k].venue : ''}`}<br />
          {`活動日期: ${data[k].date ? data[k].date : ''}`}<br />
        </div>
      )});
      return 0;
    });

    this.setState({ // need loading
      cardData: cardData,
      loadDialogOpen: false
    });
  }

  createAddYearData = (addYearInfo) => {
    return [
      { type: "text", name: "yearYear", text: "西元年 ex:2017", value: addYearInfo.yearYear, disabled: false },
      { type: "text", name: "yearTh", text: "屆數 ex:12", value: addYearInfo.yearTh, disabled: false },
      { type: "text", name: "yearOrganizer", text: "主辦單位 ex:中山大學", value: addYearInfo.yearOrganizer, disabled: false },
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
      let {yearYear, yearTh, yearOrganizer, yearTitle, yearDate, yearVenue,
            yearContactName, yearContactPhone, yearContactEmail, yearNCKUHost} = this.state.addYearInfo; // need check collision
      let yearUid = window.firebase.database().ref(`/years`).push().key;
      window.firebase.database().ref().update({
        [`/years/${yearUid}`]: {
          year: yearYear,
          th: yearTh,
          organizer:
          yearOrganizer,
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
          <Home />
          {addCard}
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
