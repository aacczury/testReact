import React, { Component } from 'react';
import { Drawer, Divider, List, ListItem, ListItemText, Collapse } from '@material-ui/core';
import { Done, ExpandLess, ExpandMore } from '@material-ui/icons';

import { UNIVERSITY_LIST } from '../config';

class LeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      years: {},
      sports: {},
      yearsListOpen: [],
    };
    this.yearsRef = null;
    this.yearListener = null;
    this.sportsRef = null;
    this.sportsListener = null;
  }

  yearsSportsUpdate = () => {
    const self = this;

    if (this.yearsRef && this.yearsRef.off && this.yearListener) {
      this.yearsRef.off('value', this.yearListener);
      this.yearListener = null;
    }
    if (this.sportsRef && this.sportsRef.off && this.sportsListener) {
      this.sportsRef.off('value', this.sportsListener);
      this.sportsListener = null;
    }

    if (!this.props.user) {
      return;
    }

    this.yearsRef = window.firebase.database().ref(`/years`);
    this.yearListener = this.yearsRef.on('value', years => {
      self.setState({years: years.val() ? years.val() : {}});
    });
    this.sportsRef = window.firebase.database().ref(`/sports`);
    this.sportsListener = this.sportsRef.on('value', sports => {
      self.setState({sports: sports.val() ? sports.val() : {}});
    });
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
    if (this.yearsRef && this.yearsRef.off && this.yearListener) {
      this.yearsRef.off('value', this.yearListener);
      this.yearListener = null;
    }
    if (this.sportsRef && this.sportsRef.off && this.sportsListener) {
      this.sportsRef.off('value', this.sportsListener);
      this.sportsListener = null;
    }
  }

  handleLeftMenuButtonClick = url => {
    this.props.handleMenuClose();
    this.props.handleRedirect(url);
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
    let sport = this.state.sports[years[y].th][s];
    let university = 0 <= UNIVERSITY_LIST.indexOf(this.props.user.auth) ? this.props.user.auth : "ncku";
    let handleOnClick = () => this.handleLeftMenuButtonClick(`/?th=${years[y].th}&university=${university}&sport=${s}`);
    let isDisabled = false;
    let isButton = true;
    let rightIcon = null;

    if (sport.is_finish && university in sport.is_finish && sport.is_finish[university]) {
      if (this.props.user.auth !== "admin" && this.props.user.auth !== "overview") {
        handleOnClick = null;
        isDisabled = true;
        isButton = false;
      }
      rightIcon = <Done style={{color: "#4caf50"}} />;
    }

    return (
      (this.props.user.auth === "admin" || this.props.user.auth === "overview") && years[y].ncku_host ?
      UNIVERSITY_LIST.map((uvst, uvstIndex) => {
        rightIcon = null;
        if (sport.is_finish && uvst in sport.is_finish && sport.is_finish[uvst]) {
          rightIcon = <Done style={{color: "#4caf50"}} />;
        }
        handleOnClick = () => this.handleLeftMenuButtonClick(`/?th=${years[y].th}&university=${uvst}&sport=${s}`);
        return (
          <ListItem button={isButton} key={`sportItem_${sIndex}_${uvstIndex}`} onClick={handleOnClick} disabled={isDisabled}>
            <ListItemText inset primary={`${sport.title}-${uvst.toUpperCase()}`} />
            {rightIcon}
          </ListItem>
        )
      }) :
      <ListItem button={isButton} key={`sportItem_${sIndex}`} onClick={handleOnClick} disabled={isDisabled}>
        <ListItemText inset primary={sport.title} />
        {rightIcon}
      </ListItem>
    )
  }

  yearList = (y, yIndex) => {
    let years = this.state.years;
    let overviewUniversityList = years[y].ncku_host ? UNIVERSITY_LIST : ['ncku'];
    if (!years[y].ncku_host && this.props.user.auth !== 'ncku' && this.props.user.auth !== 'admin' && this.props.user.auth !== 'overview') {
      return <React.Fragment key={`fragment_yearList_${yIndex}`}></React.Fragment>;
    }
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
                overviewUniversityList.map((university, universityIdx) => {
                  return (
                    <ListItem button key={`overview_${yIndex}_${universityIdx}`} onClick={() => this.handleLeftMenuButtonClick(`/?th=${years[y].th}&university=${university}&overview=true`)}>
                      <ListItemText inset primary={`${years[y].title}總覽-${university.toUpperCase()}`} />
                    </ListItem>
                  )
                })
              )] : []
            ).concat(
              <ListItem button key={`allSportItems_${yIndex}`} onClick={() => this.handleLeftMenuButtonClick(`/?th=${years[y].th}`)}>
                <ListItemText inset primary="所有比賽項目" />
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
          <ListItem button onClick={() => this.handleLeftMenuButtonClick(`/`)}>
            <ListItemText primary="首頁"/>
          </ListItem>
          {
            this.props.user && this.props.user.auth ?
            (
              <React.Fragment>
                <Divider />
                { Object.keys(this.state.years).map(this.yearList) }
              </React.Fragment>
            ) : null
          }
        </List>
        <Divider />
      </Drawer>
    );
  }
}

export default LeftMenu;