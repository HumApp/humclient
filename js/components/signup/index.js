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
      loaded: true,
      email: '',
      password: '',
      confirmationCode: '',
      isLoading: false
    };
  }
  handleSubmit = async () => {
    this.setState({ isLoading: true });
    try {
      newUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      await newUser.sendEmailVerification();
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
                <Input autoCapitalize="none" />
              </Item>
              <Item floatingLabel>
                <Label>Last Name</Label>
                <Input autoCapitalize="none" />
              </Item>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input autoCapitalize="none" />
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
                <Input autoCapitalize="none" />
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
