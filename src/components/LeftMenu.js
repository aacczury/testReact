import React, { Component } from 'react';
import {Drawer, MenuItem, Divider} from 'material-ui';

class LeftMenu extends Component {
  render() {
    return (
      <Drawer
        docked={false}
        open={this.props.menuOpen}
        onRequestChange={this.props.handleMenuRequestChange}
        style={{textAlign: "left"}}
      >
        <MenuItem primaryText="個人資料" onTouchTap={() => this.props.handleRedirect('/')} />
        <Divider />
        <MenuItem primaryText="11屆" onTouchTap={() => this.props.handleRedirect('/th/11')} />
      </Drawer>
    );
  }
}

export default LeftMenu;
