import React, { Component } from 'react';

import CardItem from '../components/CardItem.js';

class CardContainer extends Component {
  render() {
    let cardItems = this.props.cardData.map((d, index) => {
      return <CardItem key={`${d.title}_${index}`} {...d} handleRedirect={this.props.handleRedirect}
        handleRemoveCard={this.props.handleRemoveCard && d.uid && this.props.handleRemoveCard(d.uid)} />;
    });

    return (
      <div className="card-container" style={{maxWidth: "900px", margin: "auto"}}>
        {cardItems}
      </div>
    );
  }
}

export default CardContainer;
