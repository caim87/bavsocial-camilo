import * as React from 'react';
import * as Parse from 'parse';
import * as $ from 'jquery';

import { Link } from 'react-router-dom';
import { Navbar, NavbarToggler, Collapse } from 'reactstrap';

import Logo from '../img/BAVSOCIAL_LOGO_WHITE.png';
import Profile from '../img/profile-default.png'
import Loading from './Loading';

export default class Header extends React.Component {
  public state = {
    isOpen: false,
    loading: false
  }

  public onMenuToggle = () => {
    const { isOpen } = this.state;

    if (!isOpen) {
      $('.btn-logout').removeClass('d-none');
      $('.btn-download').addClass('d-none');
      $('.navbar-toggler-icon').addClass('active');
    } else {
      $('.btn-logout').addClass('d-none');
      $('.btn-download').removeClass('d-none');
      $('.navbar-toggler-icon').removeClass('active');
    }

    this.setState({
      isOpen: !isOpen
    });
  }

  public onLogOut = async () => {
    this.setState({ loading: true });

    await Parse.User.logOut();
    window.location.href = '/'

    this.setState({ loading: false });

  }

  public render () {
    const { loading } = this.state;

    const userName: string = `${Parse.User.current()!.get('name')} ${Parse.User.current()!.get('lastname')}`;
    const userRoll: string = `${Parse.User.current()!.get('roll')}`

    return(
      <header className="mb-3 pb-5 shadow bg-bavprimary">
        {loading && <Loading /> }
        <Navbar expand={false} className="m-0 pmd-5 px-2 py-4">
          <NavbarToggler onClick={this.onMenuToggle} />
          <Link className="nav-link w-50" to={'/'}>
            <img src={Logo} alt="logo" className="w-100 alpha-75"/>
          </Link>
          <button onClick={this.onLogOut} className="btn-bavsocial-border">Logout</button>
        </Navbar>
        <Collapse isOpen={this.state.isOpen} navbar className="pb-5">
          <div className="row justify-content-center">
            <div className="col-3 col-md-1">
              <img src={Profile} alt="profile-picture" className="w-100 profile-pic"/>
            </div>
            <div className="col-7 align-self-center">
              <span className="user-name text-white">{userName}</span>
              <br/>
              <span className="user-roll text-white">{userRoll}</span>
            </div>
          </div>
        </Collapse>
      </header>
    );
  }
}
