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
  Card,
  CardItem,
  Label,
  Icon
} from 'native-base';
import styles from './style';
import { Field, reduxForm } from 'redux-form';
import firebase from 'firebase';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      email: '',
      password: ''
    };
    this.signup = this.signup.bind(this);
  }

  async signup() {
    this.setState({
      loaded: false
    });
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      console.log('Account created');
    } catch (error) {
      console.log(error);
    }
    this.setState({
      email: '',
      password: '',
      loaded: true
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <Form style={styles.form}>
              <Text style={styles.header}>Sign up</Text>
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
                <Input
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({ password: text })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Confirm Password</Label>
                <Input />
              </Item>
              <CardItem>
                <Button
                  iconRight
                  style={styles.signup}
                  rounded
                  onPress={this.signup}
                >
                  <Text style={{ fontSize: 18 }}>Sign Up</Text>
                  <Icon name="ios-arrow-forward" style={{ color: '#fff' }} />
                </Button>
              </CardItem>
            </Form>
          </Card>
        </Content>
      </Container>
    );
  }
}
