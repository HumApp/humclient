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
      currentUser: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('currentUser').then(userData => {
      let currentUser = JSON.parse(userData);
      this.setState({
        currentUser
      });
    });
  }

  render() {
    const AppNavigator = createRootNavigator(this.state.currentUser);
    return (
      <Root>
        <AppNavigator />
      </Root>
    );
  }
}
