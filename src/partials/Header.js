import React, { Component } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { Home, Menu } from '@material-ui/icons';

import LeftMenu from './LeftMenu';

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
        <IconButton onClick={this.handleMenuToggle} color="inherit">
          <Menu />
          <LeftMenu user={this.props.user} menuOpen={this.state.menuOpen} handleMenuRequestChange={this.handleMenuRequestChange} handleRedirect={this.props.handleRedirect} />
        </IconButton>
      );
      rightButton = <Button onClick={this.props.handleHeaderButtonClick} color="inherit">登出</Button>
    }
    else if(this.props.login) {
      leftButton = (<IconButton color="inherit"><Home /></IconButton>);
      rightButton = null;
    }
    else {
      leftButton = (<IconButton color="inherit"><Home /></IconButton>);
      rightButton = <Button onClick={this.props.handleHeaderButtonClick} color="inherit">登入</Button>
    }

    return (
      <AppBar>
        <Toolbar>
          { leftButton }
          <Typography variant="h6" color="inherit" style={{'flexGrow': 1}}>{this.props.title}</Typography>
          { rightButton }
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
