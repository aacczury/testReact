import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dialog, CircularProgress } from 'material-ui';

class LoadDialog extends Component {
  static propTypes = {
    loadDialog: PropTypes.bool.isRequired
  }

  render() {
    let { loadDialog } = this.props;
    let dialog = (
      <Dialog
        open={loadDialog}
        contentStyle={{ width: "100px", height: "100px" }}
        modal={true}
      >
        <CircularProgress
          size={50}
          thickness={7}
        />
      </Dialog>
    )
    return dialog;
  }
}

const mapStateToProps = state => {
  console.log(state);
  return Object.freeze({
    loadDialog: state.loadDialog
  })
}

export default connect(mapStateToProps)(LoadDialog);