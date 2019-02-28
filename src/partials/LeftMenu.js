import React, { Component } from 'react';
import { Drawer, Divider, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { Done, ExpandLess, ExpandMore } from '@material-ui/icons';

class LeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      years: {},
      sports: {},
      yearsListOpen: [],
    };
    this.yearsRef = null;
    this.sportsRef = null;
  }

  yearsSportsUpdate = () => {
    const self = this;

    if (this.yearsRef && this.yearsRef.off) {
      this.yearsRef.off();
    }
    if (this.sportsRef && this.sportsRef.off) {
      this.sportsRef.off();
    }

    if(this.props.user){
      this.yearsRef = window.firebase.database().ref(`/years`);
      this.yearsRef.on('value', years => {
        self.setState({years: years.val() ? years.val() : {}});
      });
      this.sportsRef = window.firebase.database().ref(`/sports`);
      this.sportsRef.on('value', sports => {
        self.setState({sports: sports.val() ? sports.val() : {}});
      });
    }
  }

  componentDidMount() {
    this.yearsSportsUpdate();
  }

  componentDidUpdate(prevProps) {
    if (!this.props.user || !prevProps.user || prevProps.user.uid !== this.props.user.uid) {
      this.yearsSportsUpdate();
    }
  }

  componentWillUnmount() {
    if (this.yearsRef && this.yearsRef.off) {
      this.yearsRef.off();
    }
    if (this.sportsRef && this.sportsRef.off) {
      this.sportsRef.off();
    }
  }

  handleYearListOpen = yIndex => {
    this.setState(prevState => {
      if (prevState.yearsListOpen[yIndex]) {
        prevState.yearsListOpen[yIndex] = false;
      } else {
        prevState.yearsListOpen[yIndex] = true;
      }
      return {yearsListOpen: prevState.yearsListOpen};
    });
  }

  sportList = (years, y, s, sIndex) => {
    const universityName = ["ncku", "cuu", "nsysu", "nchu"];
    let sport = this.state.sports[years[y].th][s];
    let university = this.props.user.auth in universityName ? this.props.user.auth : "ncku";
    let handleOnTouchTap = () => this.props.handleRedirect(`/?th=${years[y].th}&university=${university}&sport=${s}`);
    let isDisabled = false;
    let isButton = true;
    let rightIcon = null;

    if (sport.is_finish && university in sport.is_finish && sport.is_finish[university]) {
      if (this.props.user.auth !== "admin" && this.props.user.auth !== "overview") {
        handleOnTouchTap = null;
        isDisabled = true;
        isButton = false;
      }
      rightIcon = <Done style={{color: "#4caf50"}} />;
    }

    return (
      <ListItem button={isButton} key={`sportItem_${sIndex}`} onClick={handleOnTouchTap} disabled={isDisabled}>
        <ListItemText primary={sport.title} />
        {rightIcon}
      </ListItem>
    )
  }

  yearList = (y, yIndex) => {
    let years = this.state.years;
    return (
      <React.Fragment key={`fragment_yearList_${yIndex}`}>
        <ListItem button key={`th_${yIndex}`} onClick={this.handleYearListOpen.bind(null, yIndex)}>
          <ListItemText primary={years[y].title} />
          {this.state.yearsListOpen[yIndex] ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.yearsListOpen[yIndex]} unmountOnExit>
          <List>
          {
            (
              this.props.user.auth === "admin" || this.props.user.auth === "overview" ?
              [(
                <ListItem button key={`overview_${yIndex}`} onClick={() => this.props.handleRedirect(`/?th=${years[y].th}&overview=true`)}>
                  <ListItemText primary={`${years[y].title}總覽`} />
                </ListItem>
              )] : []
            ).concat(
              <ListItem button key={`allSportItems_${yIndex}`} onClick={() => this.props.handleRedirect(`/?th=${years[y].th}`)}>
                <ListItemText primary="所有比賽項目" />
              </ListItem>
            ).concat(
              years[y].th in this.state.sports ? Object.keys(this.state.sports[years[y].th]).map(this.sportList.bind(null, years, y)) : []
            )
          }
          </List>
        </Collapse>
      </React.Fragment>
    )
  }

  render() {
    return (
      <Drawer open={this.props.menuOpen} onClose={this.props.handleMenuClose}>
        <List style={{minWidth: 250, width: '10vw'}}>
          <ListItem button onClick={() => this.props.handleRedirect(`/`)}>
            <ListItemText primary="首頁"/>
          </ListItem>
          <Divider />
          { Object.keys(this.state.years).map(this.yearList) }
        </List>
        <Divider />
      </Drawer>
    );
  }
}

export default LeftMenu;