import React, { Component } from 'react';
import {FlatButton, Dialog} from 'material-ui';

class AddDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addDialogOpen: this.props.addDialogOpen ? true : false
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.addDialogOpen !== this.state.addDialogOpen)
      this.setState({addDialogOpen: nextProps.addDialogOpen ? true : false})
  }

  render() {
    let addDialogActions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.props.handleAddDialogClose}
      />,
      <FlatButton
        label="送出"
        primary={true}
        onTouchTap={this.props.handleAddSubmit}
      />,
    ];

    let addDialog = (
      <Dialog
        title={this.props.title}
        actions={addDialogActions}
        modal={false}
        open={this.state.addDialogOpen}
        onRequestClose={this.props.handleAddDialogClose}
        contentStyle={{maxWidth: "300px"}}
        autoScrollBodyContent={true}
      >
        {this.props.content}
      </Dialog>
    )
    return addDialog;
  }
}

export default AddDialog;
