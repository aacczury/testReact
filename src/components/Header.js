import React, { Component } from 'react';

class Header extends Component {
  render() {
    let button = null;
    if(this.props.buttonTitle){
        button = <a id="log-link" className="mdl-navigation__link"
          onClick={this.props.handleHeaderButtonClick} style={{cursor: "pointer"}}>{this.props.buttonTitle}</a>;
    }

    return (
      <header className="mdl-layout__header mdl-layout--fixed-header">
        {/* Top row, always visible */}
        <div className="mdl-layout__header-row">
          {/* Title */}
          <span className="mdl-layout-title">{this.props.title}</span>
          <div className="mdl-layout-spacer"></div>
          {/* Navigation */}
          <nav className="mdl-navigation mdl-js-ripple-effect">
            <a className="mdl-navigation__link is-active" style={{cursor: "pointer"}}>11th</a>
            <a className="mdl-navigation__link is-active" style={{cursor: "pointer"}}>Info</a>
            {button}
          </nav>
        </div>
      </header>
    );
  }
}

export default Header;
