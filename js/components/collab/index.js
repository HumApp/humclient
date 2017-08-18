import React, { Component } from 'react';
import { Container, Content, Button, Icon, Text } from 'native-base';
import firebase from 'firebase';

export default class Collab extends Component {
  render() {

    // console.log('collab', firebase.auth().currentUser.uid);

    return (
      <Container>
        <Content />
        <Button vertical active>
          <Icon name="md-headset" />
          <Text>Collab</Text>
        </Button>
      </Container>
    );
  }
}
