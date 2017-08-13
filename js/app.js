import React, { Component } from 'react';
import { createRootNavigator } from './Routers';
import Firebase from './components/util/firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    Firebase.initialise();
  }
  render() {
    const Root = createRootNavigator(false);
    return <Root />;
  }
}
