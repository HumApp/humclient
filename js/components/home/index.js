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
import Firebase from '../utils/database';
import firebase from 'firebase';
import { obj } from '../utils/testPlaylist';

const deviceHeight = Dimensions.get('window').height;

export default class Home extends Component {
  componentDidMount() {
    console.log(obj);
    Firebase.saveMultiPlaylists(obj, 'appleId');
  }

  goToLogIn = currUser => {
    this.props.navigation.navigate('Login', currUser);
  };

  goToSignUp = newUser => {
    this.props.navigation.navigate('Signup', newUser);
  };

  render() {
    return (
      <LinearGradient
        colors={['#FF5A5F', '#FC642D', '#ebcbb9']}
        style={styles.container}
      >
        <Text style={styles.title}>HUM</Text>
        <Text style={styles.subtitle}>Welcome to Hum.</Text>
        <View style={styles.buttonContainer}>
          <View style={{ marginTop: 5, marginBottom: 5 }}>
            <Button
              rounded
              style={styles.signup}
              onPress={() => this.goToSignUp()}
            >
              <Text style={{ color: '#FC642D' }}>Sign Up</Text>
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
