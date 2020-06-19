import React, { PureComponent } from 'react';
import {
 HashRouter, Route, Redirect, Switch,
} from 'react-router-dom';
import Test from '@container';
import './styles/global.less';
import './styles/iconfont.css';

export default class App extends PureComponent {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" exact render={() => (<Redirect to="/home" />)} />
          <Route path="/home" component={Test} />
        </Switch>
      </HashRouter>
    );
  }
}
