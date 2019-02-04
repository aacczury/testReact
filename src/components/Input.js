import React, { Component } from 'react';
import { TextField, FormControlLabel, Checkbox } from '@material-ui/core';

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.name + +new Date(),
      value: typeof this.props.value === 'undefined' ? '' : this.props.value
    };
  }

  componentWillReceiveProps = (nextProps) => {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.value !== this.state.value) {
      this.setState({ value: typeof nextProps.value === 'undefined' ? '' : nextProps.value });
    }
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.props.handleInputUpdate({
      [name]: value
    });
  }

  render() {
    let inputComponent = null;
    if(this.props.type === "text" || this.props.type === "email" || this.props.type === "password") {
      inputComponent = (
        <TextField
          fullWidth={true}
          value={this.state.value}
          label={this.props.text}
          margin='dense'
          onChange={this.handleChange}
          disabled={this.props.disabled ? true : false}
          name={this.props.name}
          type={this.props.type}
          error={this.props.errorText ? true : false}
          helperText={this.props.errorText ? this.props.errorText : ''}
        />
      )
    }else if(this.props.type === "checkbox") {
      inputComponent = (
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.value ? true : false}
              onChange={this.handleChange}
              disabled={this.props.disabled ? true : false}
              name={this.props.name}
            />
          }
          label={this.props.text}
        />
      )
    }

    return inputComponent;
  }
}

export default Input;
