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
import styles from './styles'
import { Field, reduxForm } from 'redux-form';

export default class UpdatePassword extends Component {
  render() {
    return (
      <Container>
        <Card>
          <Content>
            <Form style={styles.form}>
              <Item floatingLabel>
                <Label>Current Password</Label>
                <Input autoCapitalize="none" secureTextEntry={true} />
              </Item>
              <Item floatingLabel>
                <Label>New Password</Label>
                <Input autoCapitalize="none" secureTextEntry={true} />
              </Item>
              <Item floatingLabel>
                <Label>Confirm New Password</Label>
                <Input autoCapitalize="none" secureTextEntry={true} />
              </Item>
              <CardItem>
                <Button rounded iconRight style={styles.login}
                  onPress={() =>
                    this.props.navigation.navigate('Profile')}
                >
                  <Text style={{ fontSize: 18 }}>Confirm</Text>
                  <Icon name='ios-arrow-forward' style={{ color: '#fff' }} />
                </Button>
              </CardItem>
            </Form>
          </Content>
        </Card>
      </Container>
    );
  }
}
