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
import styles from './style.js';

const humLogo = require('../../../images/illegal-logo.png');
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
      <Container>
        <View style={styles.container}>
          <Content>
            <Text> Log in</Text>
            <Image source={humLogo} style={styles.img} />
            <View style={styles.bg}>
              <Button
                rounded
                style={styles.signBtn}
                onPress={() => this.goToSignUp()}
              >
                <Text>Sign Up</Text>
              </Button>
              <Button
                light
                rounded
                style={styles.loginBtn}
                onPress={() => this.goToLogIn()}
              >
                <Text>Login</Text>
              </Button>
            </View>
          </Content>
        </View>
      </Container>
    );
  }
}
