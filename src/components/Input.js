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
    let inputComponent = null;
    if(this.props.type === "text" || this.props.type === "email" || this.props.type === "date") {
      inputComponent = (
        <div ref={(inputNode) => {this.inputNode = inputNode;}} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
          <input className="mdl-textfield__input" type={this.props.type} name={this.props.name}
            id={this.state.id} value={this.state.value} onChange={this.handleChange} disabled={this.props.disabled} />
          <label className="mdl-textfield__label" htmlFor={this.state.id}>{this.props.text}</label>
        </div>
      )
    }else if(this.props.type === "checkbox") {
      inputComponent = (
        <label ref={(inputNode) => {this.inputNode = inputNode;}}
          className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={this.state.id}>
          <input type={this.props.type} name={this.props.name}
            id={this.state.id} className="mdl-checkbox__input" />
          <span className="mdl-checkbox__label">{this.props.text}</span>
        </label>
      )
    }


    return inputComponent;
  }
}

export default Input;
