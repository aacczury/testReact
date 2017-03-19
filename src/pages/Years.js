import React, { Component } from 'react';
import {ActionHome} from 'material-ui/svg-icons';

import AddCard from '../components/AddCard';
import AddDialog from '../components/AddDialog';
import CardContainer from '../containers/CardContainer';
import InputContainer from '../containers/InputContainer';

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
        yearNCKUHost: false
      },
      addDialogOpen: false
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
      cardData.push({ title: data[k].title, subtitle: data[k].organizer, url: `/?th=${data[k].th}` });
      return 0;
    });

    this.setState({ // need loading
      cardData: cardData
    });
  }

  createAddYearData = (addYearInfo) => {
    return [
      { type: "text", name: "yearYear", text: "西元年 ex:2017", value: addYearInfo.yearYear, disabled: false },
      { type: "text", name: "yearTh", text: "屆數 ex:12", value: addYearInfo.yearTh, disabled: false },
      { type: "text", name: "yearOrganizer", text: "主辦單位 ex:中山大學", value: addYearInfo.yearOrganizer, disabled: false },
      { type: "text", name: "yearTitle", text: "顯示名稱 ex:第12屆", value: addYearInfo.yearTitle, disabled: false },
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
      let {yearYear, yearTh, yearOrganizer, yearTitle, yearNCKUHost} = this.state.addYearInfo; // need check collision
      let yearUid = window.firebase.database().ref(`/years`).push().key;
      window.firebase.database().ref().update({
        [`/years/${yearUid}`]: {year: yearYear, th: yearTh, organizer: yearOrganizer, title: yearTitle, ncku_host: yearNCKUHost}
      }, (err) => {
        // will update by on
        if(err) console.log(err);
        this.handleAddDialogClose();
        this.setState(prevState => {
          let curAddYearInfo = {yearYear: '', yearTh: '', yearOrganizer: '', yearTitle: '', yearNCKUHost: false};
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
          handleAddDialogOpen={this.handleAddDialogOpen} handleAddDialogClose={this.handleAddDialogClose}
          content={<InputContainer inputData={this.state.addYearData} handleInputUpdate={this.handleAddYearInfoUpdate} />} />;

    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          {addCard}
          <CardContainer cardData={this.state.cardData} handleRedirect={this.props.handleRedirect} />
          {addDialog}
        </div>
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
