import * as React from 'react';
import * as Parse from 'parse';

import { Link } from 'react-router-dom';
import { Form, FormGroup, Input } from 'reactstrap';

import Swal from 'sweetalert2';
import Logo from '../img/BAVSOCIAL_LOGO.png';
import Loading from '../components/Loading';

export default class Login extends React.Component {
  public state = {
    username: '',
    password: '',
    loading: false,
  }

  public onLogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    this.setState({ loading: true });

    const { username, password } = this.state;

    await Parse.User.logIn(username, password, {
      success: async (user: any) => {
        this.setState({ loading: false });
        if (user.get('emailVerified')) {
          window.location.reload();
        } else {
          await Parse.User.logOut();
          Swal({
            title: 'Error',
            type: 'error',
            text: 'User unverified'
          });
        }
      },
      error: (user: any, error: any) => {
        this.setState({ loading: false });
        console.log(`USER: ${JSON.stringify(user)}, can't login. ${error}`);
        Swal({
          title: 'Error',
          type: 'error',
          text: error.message
        });
      }
    });
  }

  public onChangeUsername = (
    event: {
      preventDefault: () => void,
      target: { value: string }
    }
  ) => {
    event.preventDefault();

    this.setState({
      username: event.target.value
    });
  }

  public onChangePassword = (
    event: {
      preventDefault: () => void,
      target: { value: string }
    }
  ) => {
    event.preventDefault();

    this.setState({
      password: event.target.value
    });
  }

  public render () {
    const { username, password, loading } = this.state;

    return (
      <div className="bg-bavprimary h-100">
        {loading && <Loading />}
        <div className="bg-white p-4 shadow align-middle rounded-20 vertical-center">
          <div className="text-center mt-4 mb-5">
            <img src={Logo} alt="logo" className="w-100"/>
          </div>
          <Form className="mt-5" onSubmit={this.onLogin}>
            <FormGroup>
              <Input
                type="text"
                name="username"
                placeholder="Usuario"
                className="text-center"
                defaultValue={username}
                onChange={this.onChangeUsername} />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                placeholder="Pasword"
                className="mt-4 text-center"
                defaultValue={password}
                onChange={this.onChangePassword} />
            </FormGroup>
            <div className="text-center mt-2">
              <Link to={'/forgotpass'}>Olvidé mi contraseña</Link>
            </div>
            <div className="text-center mt-4 mb-5">
              <button className="bg-bavsecundary btn-bavsocial">Login</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}