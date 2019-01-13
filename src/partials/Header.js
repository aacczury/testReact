import React, { Component } from 'react';
import { AppBar, IconButton, Button } from '@material-ui/core';
import { Home, Menu } from '@material-ui/icons';

import LeftMenu from './LeftMenu';

import {fontFamily} from '../config';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    }
  }

  handleMenuToggle = () => this.setState({menuOpen: !this.state.menuOpen});
  handleMenuRequestChange = (menuOpen) => this.setState({menuOpen});

  render() {
    let leftButton = null;
    let rightButton = null;
    if(this.props.user) {
      leftButton = (
        <IconButton
          onClick={this.handleMenuToggle}>
          <Menu />
          <LeftMenu user={this.props.user} menuOpen={this.state.menuOpen} handleMenuRequestChange={this.handleMenuRequestChange} handleRedirect={this.props.handleRedirect} />
        </IconButton>
      );
      rightButton = <Button labelStyle={{fontFamily: fontFamily}} onClick={this.props.handleHeaderButtonClick} label="登出" />
    }
    else if(this.props.login) {
      leftButton = (<IconButton><Home /></IconButton>);
      rightButton = null;
    }
    else {
      leftButton = (<IconButton><Home /></IconButton>);
      rightButton = <Button labelStyle={{fontFamily: fontFamily}} onClick={this.props.handleHeaderButtonClick} label="登入" />
    }

    return (
      <AppBar
        title={this.props.title}
        iconElementLeft={leftButton}
        iconElementRight={rightButton}
        titleStyle={{fontFamily: fontFamily}}
      />
    );
  }
}

export default Header;
