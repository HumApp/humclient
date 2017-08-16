import React, { Component } from 'react';
import { Root } from 'native-base';
import { createRootNavigator } from './Routers';
import Firebase from '../utils/firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    Firebase.initialize();
  }
  render() {
    const AppNavigator = createRootNavigator(false);
    return (
      <Root>
        <AppNavigator />
      </Root>
    );
  }
}
