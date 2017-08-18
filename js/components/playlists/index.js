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
  Input,
  Spinner,
  Badge
} from 'native-base';
import styles from './styles';
import Database from '../../../utils/database';
import { AsyncStorage } from 'react-native';

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: []
    };
  }
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  getUserPlaylists = async userId => {
    let playlistArr = [];
    await firebase
      .database()
      .ref(`playlists/`)
      .orderByChild('creator')
      .equalTo(userId)
      .once('value')
      .then(playlists => {
        playlists.forEach(playlist => {
          let newPlaylistObj = Object.assign(playlist.val());
          newPlaylistObj.playlistRef = playlist.ref;
          playlistArr.push(newPlaylistObj);
        });
      });
    return playlistArr;
  };

  pendingPlaylists = () => {
    this.props.navigation.navigate('PendingPlaylists');
  };

  componentDidMount() {
    // Promise.resolve(this.getUserPlaylists("oliviaoddo"))
    // .then(playlistArr => this.setState({playlists: this.state.playlists.concat(playlistArr)}))
  }

  render() {
    // console.log('playlists', firebase.auth().currentUser.displayName);
    console.log('playlists');
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
            <CardItem button onPress={this.pendingPlaylists} header>
              <Badge style={{ backgroundColor: '#FC642D' }}>
                <Text>2</Text>
              </Badge>
              <Text style={styles.header}> Pending Playlists</Text>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow} />
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" style={styles.headerIcon} />
              <Text style={styles.header}>Playlists</Text>
            </CardItem>
            {!this.state.playlists.length
              ? <Spinner color="#FC642D" />
              : <View>
                  {this.state.playlists.map((playlist, index) => {
                    return (
                      <CardItem
                        button
                        key={index}
                        onPress={() => this.goToPlaylist(playlist)}
                      >
                        <Body>
                          <Text style={styles.bodytxt}>
                            {playlist.title}
                          </Text>
                        </Body>
                        <Right>
                          <Icon name="arrow-forward" style={styles.arrow} />
                        </Right>
                      </CardItem>
                    );
                  })}
                </View>}
          </Card>
          <Card>
            <CardItem header>
              <Icon
                active
                name="musical-note"
                style={{ color: '#484848', fontSize: 40 }}
              />
              <Text style={styles.header}>Shared with Me</Text>
            </CardItem>
            <SwipeRow
              rightOpenValue={-75}
              body={
                <CardItem>
                  <Body>
                    <Text style={styles.bodytxt}>Party</Text>
                    <Text note style={styles.bodytxt}>
                      Playlist by Brian
                    </Text>
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
                <Text note style={styles.bodytxt}>
                  Playlist by One June
                </Text>
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
