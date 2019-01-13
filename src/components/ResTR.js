import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import { Clear } from '@material-ui/icons'

import Input from './Input.js';

class ResTR extends Component {
  render() {
    let tdItems = this.props.inputData.map((d, index) => {
      return (
        <td data-label={d.label} key={`td_${index}`}>
          <Input {...d} handleInputUpdate={this.props.handleInputUpdate} />
        </td>
      );
    });

    let clearButton = null;
    if(this.props.handleRemoveParticipantInfo)
      clearButton = (
        <td data-label="">
          <IconButton>
            <Clear onClick={this.props.handleRemoveParticipantInfo} />
          </IconButton>
        </td>
      )
    else
      clearButton = (
        <td data-label="">
        </td>
      )

    return (
      <tr>
        {clearButton}
        <td data-label=""><div style={{fontWeight: "900", fontSize: "16px"}}>{this.props.status}</div></td>
        {tdItems}
      </tr>
    );
  }
}

export default ResTR;
