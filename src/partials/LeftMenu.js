import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Drawer, Divider, List, ListItem } from 'material-ui';
import { ActionDone } from 'material-ui/svg-icons';

class LeftMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      years: {},
      sports: {}
    };
  }
  static propTypes = {
    userData: PropTypes.object.isRequired
  }

  componentDidMount() {
    let { userData } = this.props;
    if (userData.uid) {
      let self = this;
      window.firebase.database().ref(`/years`).on('value', years => {
        self.setState({ years: years.val() ? years.val() : {} });
      });
      window.firebase.database().ref(`/sports`).on('value', sports => {
        self.setState({ sports: sports.val() ? sports.val() : {} });
      });
    }
  }

  render() {
    let { userData } = this.props;
    return (
      <Drawer docked={false} open={this.props.menuOpen}
        onRequestChange={this.props.handleMenuRequestChange} style={{ textAlign: "left" }} >
        <List>
          <ListItem primaryText="首頁" onTouchTap={() => this.props.handleRedirect(`/`)} />
          <Divider />
          {
            Object.keys(this.state.years).map((y, yIndex) => {
              let years = this.state.years;
              return <ListItem key={`th_${yIndex}`} primaryText={years[y].title} primaryTogglesNestedList={true} nestedItems={
                (userData.auth === "admin" || userData.auth === "overview" ?
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
                          if (userData.auth in universityName) university = userData.auth;
                          let handleOnTouchTap = () => this.props.handleRedirect(`/?th=${years[y].th}&university=${university}&sport=${s}`);
                          let handleDisabled = false;
                          let rightIcon = null;
                          let style = {};
                          if (sport.is_finish && university in sport.is_finish && sport.is_finish[university]) {
                            if (userData.auth !== "admin" && userData.auth !== "overview") {
                              handleOnTouchTap = null;
                              handleDisabled = true;
                              style = { cursor: "default" };
                            }
                            rightIcon = <ActionDone color="#4caf50" />;
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

const mapStateToProps = state => {
  console.log(state);
  let props = {};
  Object.defineProperty(props, "userData", {
    value: state.userData,
    writable: false,
    enumerable: true,
    configurable: false
  });
  return props
}

export default connect(mapStateToProps)(LeftMenu);