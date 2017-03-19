import React, { Component } from 'react';

class Header extends Component {
  render() {
    let userNext = !this.props.isUserLogin ? "login" : "logout";
    let button = <a id="log-link" className="mdl-navigation__link"
        onClick={this.props.headerClick(userNext)} style={{cursor: "pointer"}}>{userNext}</a>;

    return (
      <div className="mdl-layout__header mdl-layout--fixed-header">
        <header className="mdl-layout__header">
          {/* Top row, always visible */}
          <div className="mdl-layout__header-row">
            {/* Title */}
            <span className="mdl-layout-title">{this.props.title}</span>
            <div className="mdl-layout-spacer"></div>
            {/* Navigation */}
            <nav className="mdl-navigation">
              {button}
            </nav>
          </div>
        </header>
      </div>
    );
  }
}

export default Header;
