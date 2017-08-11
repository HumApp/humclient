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
  ListItem
} from 'native-base';
export default class Playlists extends Component {
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem itemDivider first>
              <Text>My Playlists</Text>
            </ListItem>
            <ListItem onPress={() => this.goToPlaylist('Simon Mignolet')}>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <List>
            <ListItem itemDivider first>
              <Text>Shared with Me</Text>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Shared</Text>
                <Text note>Owned by One June</Text>
              </Body>
              <Right>
                <Body>
                  <Left>
                    <Icon name="ios-checkmark-circle" />
                  </Left>
                  <Right>
                    <Icon name="ios-close-circle" />
                  </Right>
                </Body>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Shared</Text>
                <Text note>Owned by One June</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Shared</Text>
                <Text note>Owned by One June</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Shared</Text>
                <Text note>Owned by One June</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Shared</Text>
                <Text note>Owned by One June</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Shared</Text>
                <Text note>Owned by One June</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Shared</Text>
                <Text note>Owned by One June</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
