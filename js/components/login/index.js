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
  Toast,
  CardItem,
  Label,
  Spinner,
  Icon
} from 'native-base';
import styles from './style';
import { Field, reduxForm } from 'redux-form';
import firebase from 'firebase';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: '',
      password: ''
    };
  }

  validateForm() {
    return this.state.user.length > 0 && this.state.password.length > 0;
  }

  login = async () => {
    try {
      this.setState({ isLoading: true });
      const currentUser = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.user, this.state.password);
      Toast.show({
        text: `Logged in with ${this.state.user}`,
        position: 'top',
        buttonText: 'Okay',
        duration: 2000
      });
      if (firebase.auth().currentUser.emailVerified)
        this.props.navigation.navigate('SignedIn');
      else throw 'Your email has to be verified! Check your email!';
    } catch (err) {
      Toast.show({
        text: `${err}`,
        position: 'top',
        buttonText: 'Okay',
        duration: 2000
      });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const content = this.state.isLoading
      ? <Spinner />
      : <Card>
          <Content>
            <Text style={styles.loginTxt}>Log in</Text>
            <Form style={styles.form}>
              <Item floatingLabel>
                <Label>Email or Username</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.user}
                  onChangeText={text => this.setState({ user: text })}
                />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({ password: text })}
                />
              </Item>
              <CardItem>
                <Button
                  rounded
                  iconRight
                  style={!this.validateForm() ? styles.disabled : styles.login}
                  onPress={this.login}
                  disabled={!this.validateForm()}
                >
                  <Text style={{ fontSize: 18 }}>Log in</Text>
                  <Icon name="ios-arrow-forward" style={{ color: '#fff' }} />
                </Button>
              </CardItem>
              <CardItem>
                <Button
                  rounded
                  iconRight
                  style={styles.login}
                  onPress={() => this.props.navigation.navigate('Signup')}
                >
                  <Text style={{ fontSize: 18 }}>go to sign up</Text>
                  <Icon name="ios-arrow-forward" style={{ color: '#fff' }} />
                </Button>
              </CardItem>
            </Form>
          </Content>
        </Card>;
    return (
      <Container>
        {content}
      </Container>
    );
  }
}
