import React, { Component } from 'react';
import {AppBar, IconMenu, IconButton, MenuItem, FlatButton, Divider} from 'material-ui';
import {NavigationExpandMore} from 'material-ui/svg-icons'

class Header extends Component {
  render() {
    let rightButton = null;
    if(this.props.user) {
      rightButton = (
        <IconMenu
          iconButtonElement={<IconButton><NavigationExpandMore /></IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText="登出" onTouchTap={this.props.handleHeaderButtonClick} />
          <MenuItem primaryText="個人資料" onTouchTap={() => this.props.handleRedirect('/')} />
          <Divider />
          {/*need dynamic*/}
          <MenuItem primaryText="11屆" onTouchTap={() => this.props.handleRedirect('/th/11')} />
        </IconMenu>
      )
    }
    else if(this.props.route.path === '/login') {
      rightButton = null;
    }
    else {
      rightButton = <FlatButton onTouchTap={this.props.handleHeaderButtonClick} label="登入" />
    }

    return (
      <AppBar
        showMenuIconButton={false}
        title={this.props.title}
        iconElementRight={rightButton}
      />
    );
  }
}

export default Header;
