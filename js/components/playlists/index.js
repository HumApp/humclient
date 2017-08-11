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
export default class Playlists extends Component {
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" />
              <Text>Playlists</Text>
            </CardItem>
            <CardItem button onPress={() => this.goToPlaylist()}>
              <Body>
                <Text>Summer</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Vibes</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Chill</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="musical-note" />
              <Text>Shared with Me</Text>
            </CardItem>
            <SwipeRow
              rightOpenValue={-75}
              body={
                <CardItem>
                  <Body>
                    <Text>Party</Text>
                  </Body>
                  <Right>
                    <Icon name="ios-checkmark-circle" />
                  </Right>
                </CardItem>
              }
              right={
                <Button danger onPress={() => alert('Trash')}>
                  <Icon active name="trash" />
                </Button>
              }
            />
            <CardItem>
              <Body>
                <Text>Beets</Text>
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
