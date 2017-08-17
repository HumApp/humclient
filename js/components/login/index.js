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

  login = async () => {
    try {
      this.setState({ isLoading: true });
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password);
      AsyncStorage.setItem('user', JSON.stringify(user));
      Toast.show({
        text: `Logged in with ${this.state.email}`,
        position: 'top',
        buttonText: 'Okay',
        duration: 2000
      });
      this.props.navigation.navigate('SignedIn');
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
                <Label>Username</Label>
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
