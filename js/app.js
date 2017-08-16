import React, { Component } from 'react';
import { Root } from 'native-base';
import { createRootNavigator } from './Routers';
import Firebase from '../utils/firebase';
import { AsyncStorage } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props);
    Firebase.initialize();
    this.state = {
      currentUser: null
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('user').then(userData => {
      let user = JSON.parse(userData);
      this.setState({
        user
      });
    });
  }

  render() {
    const AppNavigator = createRootNavigator(this.state.user);
    return (
      <Root>
        <AppNavigator />
      </Root>
    );
  }
}
