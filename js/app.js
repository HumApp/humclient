import React, { Component } from 'react';
import { Root } from 'native-base';
import { createRootNavigator } from './Routers';
import Firebase from './components/utils/firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    Firebase.initialise();
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
