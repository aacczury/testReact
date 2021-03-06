import React, { Component } from 'react';
import {Card} from 'material-ui';
import {ImageExposurePlus1} from 'material-ui/svg-icons';
import {grey500} from 'material-ui/styles/colors';

class CardItem extends Component {
  render() {
    let iconPlus1Size = 100;
    let cardSize = 150;
    return (
      <div style={{textAlign: "center"}}>
        <Card style={{margin: "10px", display: "inline-block", cursor: "pointer",
          paddingTop: +cardSize/2-+iconPlus1Size/2, height: +cardSize, width: +cardSize}}
          onTouchTap={this.props.handlePlus1}>
          <ImageExposurePlus1 style={{width: +iconPlus1Size, height: +iconPlus1Size}} color={grey500} />
        </Card>
      </div>
    );
  }
}

export default CardItem;
