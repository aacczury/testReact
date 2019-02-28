import React, { Component } from 'react';
import { Dialog, CircularProgress } from '@material-ui/core';

class LoadDialog extends Component {
  shouldComponentUpdate = (nextProps) => {
    if(nextProps.loadDialogOpen !== this.props.loadDialogOpen) {
      return true;
    }
    return false;
  }

  render() {
    let loadDialog = (
      <Dialog open={this.props.loadDialogOpen ? this.props.loadDialogOpen : false}>
        <div style={{margin: 50, overflow: 'hidden'}}>
          <CircularProgress size={50} thickness={7} />
        </div>
      </Dialog>
    )
    return loadDialog;
  }
}

export default LoadDialog;
