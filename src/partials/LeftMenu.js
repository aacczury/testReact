import React, { Component } from 'react';
import {Drawer, MenuItem, Divider, List, ListItem} from 'material-ui';

class LeftMenu extends Component {
  render() {
    return (
      <Drawer
        docked={false}
        open={this.props.menuOpen}
        onRequestChange={this.props.handleMenuRequestChange}
        style={{textAlign: "left"}}
      >
        <List>
          <ListItem
              primaryText="11屆"
              initiallyOpen={true}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  key={1}
                  primaryText="總覽"
                  onTouchTap={() => this.props.handleRedirect('/11/overview')}
                />,
                <ListItem
                  key={2}
                  primaryText="比賽項目"
                  primaryTogglesNestedList={true}
                  nestedItems={[
                    <ListItem key={0} primaryText="所有比賽項目" onTouchTap={() => this.props.handleRedirect('/11')} />,
                    <Divider key={"d0"} />,
                    <ListItem key={1} primaryText="教職員網球" onTouchTap={() => this.props.handleRedirect('/11/-KeO8sg5ry5SdyGk3rL-')} />,
                    <ListItem key={2} primaryText="教職員羽球" onTouchTap={() => this.props.handleRedirect('/11/-KeO8ulXRtmdxw3-9lfR')} />
                  ]}
                />,
              ]}
            />
        </List>
        <MenuItem primaryText="個人資料" onTouchTap={() => this.props.handleRedirect('/')} />
        <Divider />
        <MenuItem primaryText="11屆" onTouchTap={() => this.props.handleRedirect('/th/11')} />
      </Drawer>
    );
  }
}

export default LeftMenu;
