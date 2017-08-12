import React, { Component } from 'react';
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  Form,
  Item,
  Input,
  Label
} from 'native-base';
import { Field, reduxForm } from 'redux-form';

export default class SignUp extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>First Name</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Last Name</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input />
            </Item>
            <Item floatingLabel last>
              <Label>Confirm Password</Label>
              <Input />
            </Item>
            <Button onPress={() => this.props.navigation.navigate('SignedIn')}>
              <Text>Sign Up</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}
