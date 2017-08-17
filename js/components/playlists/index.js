import React, { Component } from 'react';
import * as firebase from 'firebase';
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
  View,
  Thumbnail,
  Header,
  Item,
  Input
} from 'native-base';
import styles from './styles';
import Database from '../../../utils/database';
import { AsyncStorage } from 'react-native';

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    }
  }
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  // Displaying Playlists:
  // spotify.get me (state, updated after import)
  // if description === Hum playlist created by ... then render in shared
  // else in personal

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" style={styles.headerIcon} />
              <Text style={styles.header}>Playlists</Text>
            </CardItem>
            <CardItem button onPress={() => this.goToPlaylist()}>
              <Body>
                <Text style={styles.bodytxt}>Summer</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow} />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={styles.bodytxt}>Vibes</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow} />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={styles.bodytxt}>Chill</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow} />
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="musical-note" style={{ color: '#484848', fontSize: 40 }} />
              <Text style={styles.header}>Shared with Me</Text>
            </CardItem>
            <SwipeRow
              rightOpenValue={-75}
              body={
                <CardItem >
                  <Body>
                    <Text style={styles.bodytxt}>Party</Text>
                    <Text note style={styles.bodytxt}>Playlist by Brian</Text>
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
                <Text style={styles.bodytxt}>Beets</Text>
                <Text note style={styles.bodytxt}>Playlist by One June</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow} />
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
