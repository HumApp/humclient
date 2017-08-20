import React, { Component } from 'react';
import {
  Container,
  Content,
  Item,
  Input,
  Button,
  Icon,
  View,
  Text
} from 'native-base';
import { Image, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style.js';

const deviceHeight = Dimensions.get('window').height;

export default class Home extends Component {
  goToLogIn = currUser => {
    this.props.navigation.navigate('Login', currUser);
  };

  goToSignUp = newUser => {
    this.props.navigation.navigate('Signup', newUser);
  };

  render() {
    return (
      <LinearGradient
        colors={['#06db77', '#0fc3bd', '#14b9dc']}
        style={styles.container}
      >
        <Text style={styles.subtitle}>Back to the basics</Text>
        <Text style={styles.title}>HUM</Text>
        <Text style={styles.subtitle}>of sharing music</Text>
        <View style={styles.buttonContainer}>
          <View style={{ marginTop: 5, marginBottom: 5 }}>
            <Button
              rounded
              style={styles.signup}
              onPress={() => this.goToSignUp()}
            >
              <Text style={{ color: '#14b9dc' }}>Sign Up</Text>
            </Button>
          </View>
          <View style={{ marginTop: 5, marginBottom: 5 }}>
            <Button
              rounded
              style={styles.login}
              onPress={() => this.goToLogIn()}
            >
              <Text>Login</Text>
            </Button>
          </View>
        </View>
      </LinearGradient>
    );
  }
}
