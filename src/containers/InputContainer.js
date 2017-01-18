import React, { Component } from 'react';

import Input from '../components/Input.js';

class InputContainer extends Component {
  render() {
    let inputItems = this.props.inputData.map((d, index) => {
      return <Input key={d.name + index} {...d} />
    });

    const containerStyle = {
      maxWidth: "300px",
      margin: "0 auto"
    }

    return (
      <div className="input-container " style={containerStyle}>
        {inputItems}
        <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.props.addClick}>
          Add
        </button>
      </div>
    );
  }
}

export default InputContainer;
