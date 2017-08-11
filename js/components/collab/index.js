import React, { Component } from 'react';
import { Container, Content, Button, Icon, Text } from 'native-base';
export default class Collab extends Component {
  render() {
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
