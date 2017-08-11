import React, { Component } from 'react';
import { Container, Content, Button, Icon, Text } from 'native-base';
export default class Friends extends Component {
  render() {
    return (
      <Container>
        <Content />
        <Button vertical active>
          <Icon name="md-people" />
          <Text>Friends</Text>
        </Button>
      </Container>
    );
  }
}
