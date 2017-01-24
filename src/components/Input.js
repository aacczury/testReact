import React, { Component } from 'react';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.name + +new Date(),
      value: this.props.value ? this.props.value : ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.componentHandler.upgradeElement(this.inputNode);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
    if(this.inputNode.querySelector("input").getAttribute("name")) {  // need check input data
      this.props.handleInfoUpdate({
        [this.inputNode.querySelector("input").getAttribute("name")]: e.target.value
      });
    }
  }

  render() {
    return (
      <div ref={(inputNode) => {this.inputNode = inputNode;}} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type={this.props.type} name={this.props.name}
          id={this.state.id} value={this.state.value} onChange={this.handleChange} disabled={this.props.disabled} />
        <label className="mdl-textfield__label" htmlFor={this.state.id}>{this.props.text}</label>
      </div>
    );
  }
}

export default Input;
