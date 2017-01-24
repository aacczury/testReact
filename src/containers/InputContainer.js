import React, { Component } from 'react';

import Input from '../components/Input.js';

class InputContainer extends Component {
  render() {
    let inputItems = this.props.inputData.map((d, index) => {
      return <Input key={d.name + index} {...d} handleInfoUpdate={this.props.handleInfoUpdate} />
    });

    const inputContainerStyle = {
      maxWidth: "300px",
      margin: "10px auto"
    }

    return (
      <div className="input-container" style={inputContainerStyle}>
        {inputItems}
      </div>
    );
  }
}

export default InputContainer;
