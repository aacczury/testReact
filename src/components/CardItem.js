import React, { Component } from 'react';
import {Card, CardTitle, CardText, IconButton} from 'material-ui';
import {ContentClear} from 'material-ui/svg-icons';

class CardItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.title + +new Date()
    };
  }

  render() {
    let cardContent = null;
    if(this.props.content) {
      cardContent = (
        <CardText>
          {this.props.content}
        </CardText>
      )
    }

    let cardComponent = null;
    if(this.props.url) {
      cardComponent = (
        <Card style={{width: "280px", height: this.props.cardHeight, margin: "10px", display: "inline-block"}}>
          <div style={{textAlign: "right"}}><IconButton><ContentClear /></IconButton></div>
          <CardTitle title={this.props.title} subtitle={this.props.subtitle} style={{cursor: "pointer"}}
            onTouchTap={() => this.props.router.push(this.props.url)} />
          {cardContent}
        </Card>
      )
    }
    else {
      cardComponent = (
        <Card style={{width: "280px", height: +this.props.cardHeight, margin: "10px", display: "inline-block"}}>
          <div style={{textAlign: "right"}}><IconButton><ContentClear /></IconButton></div>
          <CardTitle title={this.props.title} subtitle={this.props.subtitle}  />
          {cardContent}
        </Card>
      )
    }

    return cardComponent;
  }
}

export default CardItem;
