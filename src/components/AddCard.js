import React, { Component } from 'react';
import {Card} from 'material-ui';
import {ImageExposurePlus1} from 'material-ui/svg-icons';
import {grey500} from 'material-ui/styles/colors';

class CardItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.title + +new Date()
    };
  }

  render() {
    let iconPlus1Size = 100;
    return (
      <Card style={{width: "280px", margin: "10px", display: "inline-block", cursor: "pointer",
        paddingTop: +this.props.cardHeight/2-+iconPlus1Size/2, height: +this.props.cardHeight, verticalAlign: "top"}}
        onTouchTap={this.props.handlePlus1}>
        <ImageExposurePlus1 style={{width: +iconPlus1Size, height: +iconPlus1Size}} color={grey500} />
      </Card>
    );
  }
}

export default CardItem;
