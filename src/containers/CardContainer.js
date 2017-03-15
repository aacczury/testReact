import React, { Component } from 'react';

import CardItem from '../components/CardItem.js';
import AddCard from '../components/AddCard'

class CardContainer extends Component {
  render() {
    let cardItems = this.props.cardData.map((d, index) => {
      return <CardItem key={`${d.title}_${index}`} {...d} handleRedirect={this.props.handleRedirect}
        cardHeight={this.props.cardHeight}
        handleCardTouch={this.props.handleCardTouch}
        handleRemoveParticipantInfo={this.props.handleRemoveParticipantInfo && d.uid && this.props.handleRemoveParticipantInfo(d.uid)} />;
    });

    return (
      <div className="card-container" style={{maxWidth: "900px", margin: "auto"}}>
        {this.props.plus1Position === "before" ? <AddCard handlePlus1={this.props.handlePlus1} cardHeight={this.props.cardHeight} /> : null}
        {cardItems}
        {this.props.plus1Position === "after" ? <AddCard handlePlus1={this.props.handlePlus1} cardHeight={this.props.cardHeight} /> : null}
      </div>
    );
  }
}

export default CardContainer;
