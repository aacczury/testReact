import React, { Component } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

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
    let addDialogActions = (
      <React.Fragment>
        <Button color="primary" onClick={this.props.handleAddDialogClose}>
          取消
        </Button>
        <Button color="primary" onClick={this.props.handleAddSubmit}>
          送出
        </Button>
      </React.Fragment>
    );

    let addDialog = (
      <Dialog
        open={this.state.addDialogOpen}
        onClose={this.props.handleAddDialogClose}
        scroll='paper'
      >
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent style={{width: 300}}>
          {this.props.content}
        </DialogContent>
        <DialogActions>{addDialogActions}</DialogActions>
      </Dialog>
    )
    return addDialog;
  }
}

export default AddDialog;
