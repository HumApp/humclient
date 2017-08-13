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
  Label,
  CardItem,
  Card,
  Icon
} from 'native-base';
import styles from './style'
import { Field, reduxForm } from 'redux-form';

export default class SignUp extends Component {
  render() {
    return (
      <Container>
        <Card>
        <Content>
          <Form style={styles.form}>
            <Text style={styles.header}>Login</Text>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input />
            </Item>
            <CardItem>
            <Button rounded iconRight  style={styles.login}
              onPress={() =>
                this.props.navigation.navigate('SignedIn', { signedIn: false })}
            >
              <Text style={{fontSize: 18}}>Login</Text>
               <Icon name='ios-arrow-forward' style={{color: '#fff'}}/>
            </Button>
            </CardItem>
          </Form>
        </Content>
        </Card>
      </Container>
    );
  }
}
