import * as React from 'react';
import * as Parse from 'parse';

import Login from './pages/Login';
import Analytics from './pages/Analytics/Analytics';
import ParseInit from './scripts/ParseInit';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import '@kapost/react-component-slider/lib/stylesheets/component-slider.css'

require('dotenv').config();


ParseInit();

class App extends React.Component {
  
  public render() {
    if (Parse.User.current()) {
      return (
        <Router>
          <Switch>
            <Route path="/" exact component={Analytics} />
          </Switch>
        </Router>
      );
    } else {
      return (
        <Router>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/forgotpass" exact component={Login} />
          </Switch>
        </Router>
      );
    }  
  }
}

export default App;
