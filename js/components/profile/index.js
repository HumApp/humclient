import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Left,
  Body,
  Icon,
  Text,
  Right,
  List,
  ListItem,
  Card,
  CardItem,
  SwipeRow,
  View
} from 'native-base';

export default class Profile extends Component {

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="ios-person" />
              <Text>Personal Information</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Name</Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Username</Text>
              </Body>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" />
              <Text>Integrations</Text>
            </CardItem>
            <SwipeRow
              rightOpenValue={-75}
              body={
                <CardItem>
                  <Left>
                    <Icon name="logo-apple" />
                  </Left>
                  <Body>
                    <Text>Apple Music</Text>
                  </Body>
                  <Right>
                    <Icon name="ios-checkmark-circle" />
                  </Right>
                </CardItem>
              }
              right={
                <Button danger onPress={() => alert('Trash')}>
                  <Icon active name="ios-close-circle-outline" />
                </Button>
              }
            />
            <CardItem>
              <Left>
                <Icon name="logo-apple" />
              </Left>
              <Body>
                <Text>Spotify</Text>
              </Body>
              <Right>
                <Icon name="ios-add" />
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="ios-settings" />
              <Text>Settings</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Update Password</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Report an Issue</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Delete Account</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
