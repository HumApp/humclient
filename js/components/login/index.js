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
import { Field, reduxForm } from 'redux-form';
import Playlists from '../playlists';

export default class SignUp extends Component {
  render() {
    return (
      <Button
        onPress={() =>
          this.props.navigation.navigate('SignedIn', { signedIn: false })}
      >
        <Text>Login</Text>
      </Button>
    );
  }
}
