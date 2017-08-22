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
    // console.log('constructor');
  }

  getInitialView = () => {
    // console.log('component Did mount');

    firebase.auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        // console.log('currentUSer in auth');
        this.setState({
          currentUser: currentUser
        });
      } else {
        // console.log('no currentUSer in auth');
        this.setState({
          currentUser: false
        });
      }
    });
  };

  render() {
    let landingPage;
    // console.log('render start');
    if (this.state.currentUser === null) {
      // console.log('render spinner');
      landingPage = <Spinner color="#FC642D" />;
    } else {
      // console.log('render app navigator');
      // console.log('are we getting here more than once???');
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
