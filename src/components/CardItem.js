import React, { Component } from 'react';
import { Card, CardHeader, CardContent, IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

class CardItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.title + +new Date()
    };
  }

  handCardHeaderClick = () => this.props.handleRedirect(this.props.url);

  render() {
    let cardContent = null;
    if(this.props.content) {
      cardContent = (
        <CardContent>
          {this.props.content}
        </CardContent>
      )
    }

    let clearButton = null;
    if(this.props.handleRemoveCard)
      clearButton = (
        <div style={{textAlign: "right"}}>
          <IconButton onClick={this.props.handleRemoveCard} >
            <Clear />
          </IconButton>
        </div>
      )

    let cardComponent = (
        <Card style={{width: this.props.width ? this.props.width : "280px", margin: "10px", display: "inline-block", verticalAlign: "top"}}>
          {clearButton}
          { this.props.url ?
            <CardHeader title={this.props.title} subheader={this.props.subtitle} style={{cursor: "pointer"}}
              onClick={this.handCardHeaderClick} /> :
            <CardHeader title={this.props.title} subheader={this.props.subtitle}  />
          }
          {cardContent}
        </Card>
      )

    return cardComponent;
  }
}

export default CardItem;
