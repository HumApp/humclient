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
  }
  login = async () => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password);
      Toast.show({
        text: `Logged in with ${this.state.email}`,
        position: 'top',
        buttonText: 'Okay'
      });
      this.props.navigation.navigate('SignedIn');
      firebase.database().ref(`/songs`).orderByKey().once('value', songs => {
        // console.log(songs);
        songs.forEach(song => console.log(song));
      });
    } catch (err) {
      Toast.show({
        text: `${err}`,
        position: 'top',
        buttonText: 'Okay'
      });
    }
    this.setState({
      email: '',
      password: '',
      loaded: true
    });
  };

  render() {
    return (
      <Container>
        <Card>
          <Content>
            <Form style={styles.form}>
              <Text style={styles.header}>Login</Text>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                />
              </Item>
              <Item floatingLabel last>
                <Label>Password</Label>
                <Input
                  autoCapitalize="none"
                  value={this.state.password}
                  secureTextEntry={true}
                  onChangeText={text => this.setState({ password: text })}
                />
              </Item>
              <CardItem>
                <Button iconRight style={styles.login} onPress={this.login}>
                  <Text style={{ fontSize: 18 }}>Login</Text>
                  <Icon name="ios-arrow-forward" style={{ color: '#fff' }} />
                </Button>
              </CardItem>
            </Form>
          </Content>
        </Card>
      </Container>
    );
  }
}
