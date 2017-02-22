import React, { Component } from 'react';
import {TextField, Checkbox, DatePicker} from 'material-ui';

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.name + +new Date(),
      value: this.props.value ? this.props.value : ''
    };
  }

  componentWillReceiveProps = (nextProps) => {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.value !== this.state.value) {
      this.setState({ value: typeof nextProps.value === 'undefined' ? '' : nextProps.value });
    }
  }

  handleChange = (e, v) => {
    // need check input data
    let node = e ? e.target : this.inputNode.props;
    this.setState({value: v});
    if(node.name) {
      this.props.handleInputUpdate({
        [node.name]: v
      });
    }
  }

  render() {
    let inputComponent = null;
    if(this.props.type === "text" || this.props.type === "email") {
      inputComponent = (
        <TextField
          value={this.state.value}
          floatingLabelText={this.props.text}
          onChange={this.handleChange}
          disabled={this.props.disabled ? true : false}
          name={this.props.name}
          type={this.props.type}
        />
      )
    }else if(this.props.type === "checkbox") {
      inputComponent = (
        <Checkbox
          checked={this.state.value ? true : false}
          label={this.props.text}
          onCheck={this.handleChange}
          disabled={this.props.disabled ? true : false}
          name={this.props.name}
        />
      )
    }else if(this.props.type === "date") {
      inputComponent = (
        <DatePicker ref={(inputNode) => {this.inputNode = inputNode;}}
          container="inline"
          value={this.state.value ? new Date(this.state.value) : null}
          floatingLabelText={this.props.text}
          onChange={this.handleChange}
          disabled={this.props.disabled ? true : false}
          name={this.props.name}
          style={{display: "inline-block"}}
        />
      )
    }

    return inputComponent;
  }
}

export default Input;
