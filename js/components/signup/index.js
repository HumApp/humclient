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
  Toast,
  Icon
} from 'native-base';
import styles from './style';
import { Field, reduxForm } from 'redux-form';
import firebase from 'firebase';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isLoading: false
    };
  }
  handleSubmit = async () => {
    this.setState({ isLoading: true });
    try {
      newUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          firebase.database().ref(`users/${user.uid}`).set({
            username: this.state.userName,
            email: this.state.email,
            fullname: this.state.firstName + ' ' + this.state.lastName
          });
        });
      await newUser.sendEmailVerification();
      const userId = await firebase.database().ref('users/').push().key;
      this.props.navigation.navigate('SignedIn');
      Toast.show({
        text: `Verification email sent to ${this.state.email}`,
        position: 'top',
        buttonText: 'Okay'
      });
    } catch (err) {
      Toast.show({
        text: `${err}`,
        position: 'top',
        buttonText: 'Okay'
      });
    }

    this.setState({
      isLoading: false
    });
  };

  handleConfirmationSubmit = async () => {
    this.setState({ isLoading: true });
  };

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <Form style={styles.form}>
              <Text style={styles.header}>Sign up</Text>
              <Item floatingLabel>
                <Label>First Name</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.firstName}
                  onChangeText={text => this.setState({ firstName: text })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Last Name</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.lastName}
                  onChangeText={text => this.setState({ lastName: text })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.userName}
                  onChangeText={text => this.setState({ userName: text })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({ password: text })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Confirm Password</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.confirmPassword}
                  onChangeText={text =>
                    this.setState({ confirmPassword: text })}
                />
              </Item>
              <CardItem>
                <Button
                  iconRight
                  style={styles.signup}
                  rounded
                  onPress={this.handleSubmit}
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
