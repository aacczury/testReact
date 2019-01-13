import React, { Component } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

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
      <Button
        label="取消"
        color="primary"
        onClick={this.props.handleAddDialogClose}
      />,
      <Button
        label="送出"
        color="primary"
        onClick={this.props.handleAddSubmit}
      />,
    ];

    let addDialog = (
      <Dialog
        modal={false}
        open={this.state.addDialogOpen}
        onClose={this.props.handleAddDialogClose}
        scroll='paper'
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>{addDialogActions}</DialogActions>
      </Dialog>
    )
    return addDialog;
  }
}

export default AddDialog;
