import React, { Component } from 'react';
import {Dialog, CircularProgress} from 'material-ui';

class LoadDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadDialogOpen: this.props.loadDialogOpen ? true : false
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if(nextProps.loadDialogOpen !== this.state.loadDialogOpen)
      this.setState({loadDialogOpen: nextProps.loadDialogOpen ? true : false})
  }

  render() {
    let loadDialog = (
      <Dialog
        open={this.state.loadDialogOpen}
        contentStyle={{width: "100px", height: "100px"}}
        modal={true}
        >
        <CircularProgress
          size={50}
          thickness={7}
        />
      </Dialog>
    )
    return loadDialog;
  }
}

export default LoadDialog;
