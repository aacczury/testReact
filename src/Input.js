import React, { Component } from 'react';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.name + +new Date(),
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    window.componentHandler.upgradeElement(this.inputNode);
  }

  handleChange(e) {
    this.setState({value: e.target.value});
    console.log(e.target.value);
    //this.setState({value: event.target.value});
  }

  render() {
    return (
      <div ref={(inputNode) => {this.inputNode = inputNode;}} className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
        <input className="mdl-textfield__input" type={this.props.type} name={this.props.name} id={this.state.id} value={this.state.value} onChange={this.handleChange} />
        <label className="mdl-textfield__label" htmlFor={this.state.id}>{this.props.text}</label>
      </div>
    );
  }
}

export default Input;
