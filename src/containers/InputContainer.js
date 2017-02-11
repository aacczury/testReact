import React, { Component } from 'react';

import Input from '../components/Input.js';

class InputContainer extends Component {
  render() {
    let inputItems = this.props.inputData.reduce((p, c, index) => {
      p.push(<Input key={`${c.name}_${index}`} {...c} handleInputUpdate={this.props.handleInputUpdate} />);
      p.push(<br key={`br_${c.name}_${index}`} />);
      return p;
    }, []);

    return (
      <div className="input-container">
        {inputItems}
      </div>
    );
  }
}

export default InputContainer;
