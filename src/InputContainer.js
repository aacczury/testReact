import React, { Component } from 'react';
import Input from './Input.js';

class InputContainer extends Component {
  render() {
    let inputItems = this.props.inputData.map((d, index) => {
      return <Input key={d.name + index} type={d.type} name={d.name} text={d.text} />
    });

    const containerStyle = {
      maxWidth: "300px",
      margin: "0 auto"
    }

    return (
      <div className="input-container" style={containerStyle}>
        {inputItems}
      </div>
    );
  }
}

export default InputContainer;
