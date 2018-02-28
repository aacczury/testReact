import React, { Component } from 'react';
import { Card, CardTitle, CardText, IconButton } from 'material-ui';
import { ContentClear } from 'material-ui/svg-icons';

class CardItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.title + +new Date()
    };
  }

  render() {
    let cardContent = null;
    if (this.props.content) {
      cardContent = (
        <CardText>
          {this.props.content}
        </CardText>
      )
    }

    let clearButton = null;
    if (this.props.handleRemoveCard)
      clearButton = (
        <div style={{ textAlign: "right" }}>
          <IconButton>
            <ContentClear onTouchTap={this.props.handleRemoveCard} />
          </IconButton>
        </div>
      )

    let cardComponent = (
      <Card style={{ width: "280px", margin: "10px", display: "inline-block", verticalAlign: "top" }}>
        {clearButton}
        {this.props.url ?
          <CardTitle title={this.props.title} subtitle={this.props.subtitle} style={{ cursor: "pointer" }}
            onTouchTap={() => this.props.handleRedirect(this.props.url)} /> :
          <CardTitle title={this.props.title} subtitle={this.props.subtitle} />
        }
        {cardContent}
      </Card>
    )

    return cardComponent;
  }
}

export default CardItem;