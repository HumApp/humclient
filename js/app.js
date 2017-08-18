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
    firebase.auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        // console.log('firebase user ???????????', currentUser);
        // console.log(
        //   'firebase currentUser ???????????',
        //   firebase.auth().currentUser
        // );
        this.setState({
          currentUser: currentUser
        });
      } else {
        this.setState({
          currentUser: false
        });
      }
    });
  }

  render() {
    let landingPage;
    if (this.state.currentUser === null) {
      landingPage = <Spinner color="#FC642D" />;
    } else {
      // console.log('are we getting here more than once???');
      let AppNavigator = createRootNavigator(this.state.currentUser);
      landingPage = <AppNavigator />;
    }
    return (
      <Root>
        {landingPage}
      </Root>
    );
  }
}
