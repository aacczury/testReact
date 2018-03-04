import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dialog, CircularProgress } from 'material-ui';

class LoadDialog extends Component {
  static propTypes = {
    isLoadDialogOpen: PropTypes.number.isRequired
  }

  render() {
    let { isLoadDialogOpen } = this.props;
    let dialog = (
      <Dialog
        open={isLoadDialogOpen !== 0 ? true : false}
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
  return Object.freeze({
    isLoadDialogOpen: state.isLoadDialogOpen
  })
}

export default connect(mapStateToProps)(LoadDialog);