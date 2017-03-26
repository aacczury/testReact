import React, { Component } from 'react';
import {Drawer, Divider, List, ListItem} from 'material-ui';
import {ActionDone} from 'material-ui/svg-icons';

class LeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      years: {},
      sports: {}
    };
  }

  componentDidMount() {
    if(this.props.user){
      let self = this;
      window.firebase.database().ref(`/years`).on('value', years => {
        self.setState({years: years.val() ? years.val() : {}});
      });
      window.firebase.database().ref(`/sports`).on('value', sports => {
        self.setState({sports: sports.val() ? sports.val() : {}});
      });
    }
  }

  render() {
    return (
      <Drawer docked={false} open={this.props.menuOpen}
        onRequestChange={this.props.handleMenuRequestChange} style={{textAlign: "left"}} >
        <List>
          {
            Object.keys(this.state.years).map((y, yIndex) => {
              let years = this.state.years;
              return <ListItem key={`th_${yIndex}`} primaryText={years[y].title} primaryTogglesNestedList={true} nestedItems={
                    (this.props.user.auth === "admin" ?
                      [<ListItem key={1} primaryText={`${years[y].title}總覽`}
                        onTouchTap={() => this.props.handleRedirect(`/?th=${years[y].th}&overview=true`)} />] : []
                    ).concat(
                      <ListItem key={2} primaryText="比賽項目" primaryTogglesNestedList={true} nestedItems={
                          [
                            <ListItem key={0} primaryText="所有比賽項目" onTouchTap={() => this.props.handleRedirect(`/?th=${years[y].th}`)} />
                          ].concat(
                            years[y].th in this.state.sports ?
                            Object.keys(this.state.sports[years[y].th]).map((s, sIndex) => {
                              const universityName = ["ncku", "cuu", "nsysu", "nchu"];
                              let sport = this.state.sports[years[y].th][s];
                              let university = "ncku"
                              if(this.props.user.auth in universityName) university = this.props.user.auth;
                              let handleOnTouchTap = () => this.props.handleRedirect(`/?th=${years[y].th}&university=${university}&sport=${s}`);
                              let handleDisabled = false;
                              let rightIcon = null;
                              let style = {};
                              if(this.props.user.auth !== "admin" &&
                                  sport.is_finish && university in sport.is_finish && sport.is_finish[university]) {
                                handleOnTouchTap = null;
                                handleDisabled = true;
                                rightIcon = <ActionDone color="#4caf50" />;
                                style = {cursor: "default"};
                              }
                              return <ListItem key={`sportItem_${sIndex}`} primaryText={sport.title}
                                onTouchTap={handleOnTouchTap} disabled={handleDisabled}
                                rightIcon={rightIcon} style={style} />
                            }) : []
                          )
                      } />)
                  }
                />
            })
          }
        </List>
        <Divider />
      </Drawer>
    );
  }
}

export default LeftMenu;
