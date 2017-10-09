import React, { Component } from 'react';
import { Link } from 'react-router';
import { SignupForm } from './Index';

class SignupPage extends Component {
  render() {
    return (
      <div>
        <div className="navbar-fixed">
          <nav className="header">
            <div className="nav-wrapper">
              <Link to="/" className="brand-logo return"><span className="fa fa-angle-left"></span> Back to More-Recipies</Link>
              <a href="" data-activates="navlink" className="button-collapse"><i className="material-icons">menu</i></a>         
              <ul className="right hide-on-med-and-down return">
                <li>
                  <Link to="/signin" >Log In</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="row center-align">
          <div className="col s12 l6 m8 offset-l3 offset-m2">
            <div className="card blue-grey darken-1">
              <div className="card-content white-text">
                <h5>Create New Account</h5>
              </div>
            </div>
          </div>
        </div>
        <SignupForm />
        <ul className="side-nav" id="navlink">
          <li>
            <Link to="/signin">Log In</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default SignupPage;