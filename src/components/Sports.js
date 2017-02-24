import React, { Component } from 'react';
import {ActionHome} from 'material-ui/svg-icons';

import CardContainer from '../containers/CardContainer';

class Sports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cardData: []
    };
  }

  componentDidMount() {
    if(this.props.user){ // need varify
      let self = this;
      this.dataRef = window.firebase.database().ref(`/sports/${this.props.th}`);
      this.dataRef.once('value').then(function(snapshot) {
        self.updateSports(snapshot.val());
      });
      this.dataRef.on('value', function(snapshot) {
        self.updateSports(snapshot.val());
      });
    }
  }

  componentWillUnmount() {
    if(this.dataRef && this.dataRef.off){
      this.dataRef.off();
    }
  }

  updateSports = (d) => {
    // need loading icon
    let data = d ? d : {};
    let cardData = [];
    Object.keys(data).map(k => {
      cardData.push({ title: data[k].title, subtitle: data[k].arena, url: `/${this.props.th}/${k}` });
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
            cardHeight={170}
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

export default Sports;
