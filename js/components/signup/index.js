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
  Icon,
  Spinner
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

  validateForm() {
    return (
      this.state.firstName.length > 0 &&
      this.state.lastName.length > 0 &&
      this.state.userName.length > 0 &&
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.confirmPassword.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  handleSignup = async () => {
    this.setState({ isLoading: true });
    let newUser = null;
    try {
      newUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      await newUser.updateProfile({
        displayName: this.state.userName
      });
      const warning = await firebase
        .database()
        .ref(`users/${newUser.uid}`)
        .set(
          {
            fullname: this.state.firstName + ' ' + this.state.lastName,
            username: this.state.userName,
            username: this.state.email
          },
          function(error) {
            if (error && error.code === 'PERMISSION_DENIED') {
              console.log('ERROR is => ', error.code);
              error.message = 'Sorry, your username already exists';
            }
          }
        );
      await newUser.sendEmailVerification();
      this.props.navigation.navigate('SignedOut');
      Toast.show({
        text: `Verification email sent to ${this.state.email}`,
        position: 'top',
        buttonText: 'Okay',
        duration: 3500
      });
    } catch (err) {
      newUser.delete();
      Toast.show({
        text: `${err}`,
        position: 'top',
        buttonText: 'Okay',
        duration: 3500
      });
      this.setState({ isLoading: false });
    }
  };

  handleConfirmationSubmit = async () => {
    this.setState({ isLoading: true });
  };

  render() {
    const content = this.state.isLoading
      ? <Spinner color="red" />
      : <Content>
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
                  autoCorrect={false}
                  onChangeText={text => this.setState({ userName: text })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  keyboardType="email-address"
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
                  secureTextEntry={true}
                  onChangeText={text =>
                    this.setState({ confirmPassword: text })}
                />
              </Item>
              {!this.validateForm()
                ? <CardItem>
                    <Button
                      iconRight
                      danger
                      style={styles.disabled}
                      rounded
                      onPress={this.handleSignup}
                      disabled
                    >
                      <Text style={{ fontSize: 18 }}>Sign Up</Text>
                      <Icon
                        name="ios-arrow-forward"
                        style={{ color: '#fff' }}
                      />
                    </Button>
                  </CardItem>
                : <CardItem>
                    <Button
                      iconRight
                      danger
                      style={styles.signup}
                      rounded
                      onPress={this.handleSignup}
                    >
                      <Text style={{ fontSize: 18 }}>Sign Up</Text>
                      <Icon
                        name="ios-arrow-forward"
                        style={{ color: '#fff' }}
                      />
                    </Button>
                  </CardItem>}
            </Form>
          </Card>
        </Content>;
    return (
      <Container>
        {content}
      </Container>
    );
  }
}
