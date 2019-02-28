import React, { Component } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { Home, Menu } from '@material-ui/icons';


class Header extends Component {
  render() {
    let leftButton = null;
    let rightButton = null;
    if(this.props.user) {
      leftButton = (
        <IconButton onClick={this.props.handleMenuOpen} color="inherit">
          <Menu />
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
      <AppBar position='static'>
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
