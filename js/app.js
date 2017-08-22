import React, { Component } from 'react';
import { Root } from 'native-base';
import { createRootNavigator } from './Routers';
import { Spinner } from 'native-base';
import Firebase from '../utils/firebase';
import firebase from 'firebase';

export default class App extends Component {
  constructor(props) {
    super(props);
    Firebase.initialize();
    this.getInitialView();
    this.state = {
      currentUser: null
    };
  }

  getInitialView = () => {

    firebase.auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        this.setState({
          currentUser: currentUser
        });
      } else {
        this.setState({
          currentUser: false
        });
      }
    });
  };

  render() {
    let landingPage;
    if (this.state.currentUser === null) {
      landingPage = <Spinner color="#FC642D" />;
    } else {
      let AppNavigator = createRootNavigator(
        this.state.currentUser && firebase.auth().currentUser.emailVerified
      );
      landingPage = <AppNavigator />;
    }
    return (
      <Root>
        {landingPage}
      </Root>
    );
  }
}
