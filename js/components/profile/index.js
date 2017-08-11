import React, { Component } from 'react';
import { Container, Content, Button, Icon, Text } from 'native-base';
export default class Profile extends Component {
  render() {
    return (
      <Container>
        <Content />
        <Button vertical active>
          <Icon name="md-person" />
          <Text>Profile</Text>
        </Button>
      </Container>
    );
  }
}
