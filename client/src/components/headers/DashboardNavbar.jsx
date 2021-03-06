import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'proptypes';

import { UserMenu } from './Index.jsx';

class DashboardNavbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="header">
          <div className="nav-wrapper">
            <Link
              to="/"
              className="brand-logo font-effect-3d-float logo hide-on-small-only"
            >
              More-Recipies
            </Link>
            <a
              href=""
              data-activates="dashboard"
              className="button-collapse"
            >
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down return">
              <li>
                <a className="dropdown-button" data-activates="user-dropdown">
                  <span
                    className="fa fa-lg fa-user-circle"
                  /> {this.props.user.username} <span
                    className="fa fa-lg fa-caret-down"
                  />
                </a>
                <UserMenu logoutAction={this.props.logoutAction} />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

DashboardNavbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string
  }).isRequired,
  logoutAction: PropTypes.func.isRequired
};

export default DashboardNavbar;
