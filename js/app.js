import React, { Component } from 'react';
import { createRootNavigator } from './Routers';

export default class App extends Component {
  render() {
    const Root = createRootNavigator(false);
    return <Root />;
  }
}
