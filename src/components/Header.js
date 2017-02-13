import React, { Component } from 'react';
import {AppBar, IconButton, FlatButton} from 'material-ui';
import {ActionHome, NavigationMenu} from 'material-ui/svg-icons'

import LeftMenu from './LeftMenu'

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
          <LeftMenu menuOpen={this.state.menuOpen} handleMenuRequestChange={this.handleMenuRequestChange} handleRedirect={this.props.handleRedirect} />
        </IconButton>
      );
      rightButton = <FlatButton onTouchTap={this.props.handleHeaderButtonClick} label="登出" />
    }
    else if(this.props.route.path === '/login') {
      leftButton = (<IconButton><ActionHome /></IconButton>);
      rightButton = null;
    }
    else {
      leftButton = (<IconButton><ActionHome /></IconButton>);
      rightButton = <FlatButton onTouchTap={this.props.handleHeaderButtonClick} label="登入" />
    }

    return (
      <AppBar
        title={this.props.title}
        iconElementLeft={leftButton}
        iconElementRight={rightButton}
      />
    );
  }
}

export default Header;
