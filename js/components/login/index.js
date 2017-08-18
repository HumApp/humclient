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
import { AsyncStorage } from 'react-native';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      email: '',
      password: ''
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  login = async () => {
    try {
      this.setState({ isLoading: true });
      const currentUser = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password);
      AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
      Toast.show({
        text: `Logged in with ${this.state.email}`,
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
      ? <Spinner color="#FC642D" />
      : <Card>
          <Content>
            <Text style={styles.loginTxt}>Log in</Text>
            <Form style={styles.form}>
              <Item floatingLabel>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
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
                  style={styles.login}
                  onPress={this.login}
                  disabled={!this.validateForm()}
                >
                  <Text style={{ fontSize: 18 }}>Log in</Text>
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
