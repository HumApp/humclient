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
  Card,
  CardItem,
  Icon
} from 'native-base';
import styles from './style'
import { Field, reduxForm } from 'redux-form';

export default class SignUp extends Component {
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
                <Input />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input />
              </Item>
              <Item floatingLabel>
                <Label>Confirm Password</Label>
                <Input />
              </Item>
              <CardItem>
              <Button iconRight style={styles.signup} rounded onPress={() => this.props.navigation.navigate('SignedIn')}>
                <Text style={{fontSize: 18}}>Sign Up</Text>
                <Icon name='ios-arrow-forward' style={{color: '#fff'}}/>
              </Button>
              </CardItem>
            </Form>
            </Card>
        </Content>
      </Container>
    );
  }
}
