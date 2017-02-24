import React, { Component } from 'react';
import {ActionHome} from 'material-ui/svg-icons';

import CardContainer from '../containers/CardContainer';

class Years extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: []
    };
  }

  componentDidMount() {
    if(this.props.user){
      let self = this;
      this.dataRef = window.firebase.database().ref(`/years`);
      this.dataRef.once('value').then(function(snapshot) {
        self.updateYears(snapshot.val());
      });
      this.dataRef.on('value', function(snapshot) {
        self.updateYears(snapshot.val());
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  updateYears = (d) => {
    // need loading icon
    let data = d ? d : {};
    let cardData = [];
    Object.keys(data).map(k => {
      cardData.push({ title: data[k].title, subtitle: data[k].organizer, url: `/${data[k].th}` });
      return 0;
    });

    this.setState({ // need loading
      cardData: cardData
    });
  }


  render() {
    let content = (
      <div style={{paddingTop: "64px"}}>
        <div style={{textAlign: "center"}}>
          <ActionHome />
          <CardContainer cardData={this.state.cardData} router={this.props.router}
            cardHeight={160}
            plus1Position="before" handlePlus1={this.handleAddParticipantInfo} />
        </div>
      </div>
    );

    return (
      <div className="content">
        {content}
      </div>
    );
  }
}

export default Years;
