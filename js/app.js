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
    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    // AsyncStorage.getAllKeys(function(err, keys) {
    //   keys.forEach(key => {
    //     console.log('asyncStorage Keys!!!', key);
    //   });
    // });
    // AsyncStorage.getItem(
    //   'firebase:authUser:AIzaSyAeIvTA7pcQQZ1i80667rYhX2a5oJhzaR4:[DEFAULT]'
    // ).then(userData => {
    //   let currentUser = JSON.parse(userData);
    //   console.log('this is firebase currentUser ==========', currentUser);
    //   this.setState({
    //     currentUser
    //   });
    // });
    // AsyncStorage.getItem('currentUser').then(userData => {
    //   let currentUser = JSON.parse(userData);
    //   console.log('this is async currentUser ==========', currentUser);
    //   this.setState({
    //     currentUser
    //   });
    // });

    firebase.auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        // User is signed in.
        console.log('firebase user ???????????', currentUser);
        console.log(
          'firebase currentUser ???????????',
          firebase.auth().currentUser
        );
        this.setState({
          currentUser: currentUser
        });
      } else {
        // No user is signed in.
        this.setState({
          currentUser: false
        });
      }
    });
  }

  render() {
    let AppNavigator = createRootNavigator(this.state.currentUser);
    let landingPage;
    if (this.state.currentUser == null) {
      landingPage = <Spinner color="#FC642D" />;
    } else {
      landingPage = <AppNavigator />;
    }
    return (
      <Root>
        {landingPage}
      </Root>
    );
  }
}
