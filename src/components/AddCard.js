import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import { ExposurePlus1 } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

class CardItem extends Component {
  render() {
    let iconPlus1Size = 100;
    let cardSize = 150;
    return (
      <div style={{textAlign: "center"}}>
        <Card style={{margin: "10px", display: "inline-block", cursor: "pointer",
          paddingTop: +cardSize/2 - +iconPlus1Size/2, height: +cardSize/2 + +iconPlus1Size/2, width: +cardSize}}
          onClick={this.props.handlePlus1}>
          <ExposurePlus1 style={{width: +iconPlus1Size, height: +iconPlus1Size, color: grey[500]}} />
        </Card>
      </div>
    );
  }
}

export default CardItem;
