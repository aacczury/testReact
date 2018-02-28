import React, { Component } from 'react';
import {AppBar, IconButton, FlatButton} from 'material-ui';
import {ActionHome, NavigationMenu} from 'material-ui/svg-icons';

import LeftMenu from './LeftMenu';

import {FONT_FAMILY} from '../constants/constants'

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
          onTouchTap={this.handleMenuToggle}>
          <NavigationMenu />
          <LeftMenu user={this.props.user} menuOpen={this.state.menuOpen} handleMenuRequestChange={this.handleMenuRequestChange} handleRedirect={this.props.handleRedirect} />
        </IconButton>
      );
      rightButton = <FlatButton labelStyle={{fontFamily: FONT_FAMILY}} onTouchTap={this.props.handleHeaderButtonClick} label="登出" />
    }
    else if(this.props.login) {
      leftButton = (<IconButton><ActionHome /></IconButton>);
      rightButton = null;
    }
    else {
      leftButton = (<IconButton><ActionHome /></IconButton>);
      rightButton = <FlatButton labelStyle={{fontFamily: FONT_FAMILY}} onTouchTap={this.props.handleHeaderButtonClick} label="登入" />
    }

    return (
      <AppBar
        title={this.props.title}
        iconElementLeft={leftButton}
        iconElementRight={rightButton}
        titleStyle={{fontFamily: FONT_FAMILY}}
      />
    );
  }
}

export default Header;
