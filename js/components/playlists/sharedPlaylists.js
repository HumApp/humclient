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
import * as Database from '../../../utils/database';
import { AsyncStorage } from 'react-native';

export default class SharedPlaylists extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pendingPlaylists: [],
      sharedPlaylists: [],
      sharedLoaing: true
    };
  }
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  getSharedPlaylists = async userId => {
    let playlistArr = [];
    const playlists = await firebase
      .database()
      .ref(`users/${userId}/playlists/`)
      .orderByValue()
      .equalTo("shared")
      .once('value');
    for (let playlist in playlists.val()) {
      const result = await Database.getPlaylistFromId(playlist);
      let newPlaylistObj = Object.assign(result.val());
      newPlaylistObj.playlistId = playlist;
      playlistArr.push(newPlaylistObj);
    }
    console.log('returning');
    return playlistArr;
  };

  componentDidMount() {
    const currentUser = firebase.auth().currentUser.uid;
    Promise.resolve(this.getSharedPlaylists(currentUser)).then(playlistArr =>
      this.setState(
        { sharedPlaylists: this.state.sharedPlaylists.concat(playlistArr) }, () => this.setState({ sharedLoading: false })
      )
    ).catch(error => console.log("Shared Playlists ", error));
  }

  render() {
    console.log("pending playlists", this.props.pendingPlaylists)
    return (
      <Container>
        <Content>
          {this.props.pendingPlaylists.length
            ? <Card>
              <CardItem button onPress={() => this.props.goToPending()} header>
                <Badge style={{ backgroundColor: '#FC642D' }}>
                  <Text>
                    {this.props.pendingPlaylists.length}
                  </Text>
                </Badge>
                <Text style={styles.header}> Pending Playlists</Text>
                <Right>
                  <Icon name="arrow-forward" style={styles.arrow} />
                </Right>
              </CardItem>
            </Card>
            : null}
          <Card>
            <CardItem header>
              <Icon
                active
                name="musical-note"
                style={{ color: '#484848', fontSize: 40 }}
              />
              <Text style={styles.header}>Shared with Me</Text>
            </CardItem>
            {this.state.sharedLoading
              ? <Spinner color="#FC642D" />
              : <View>
                {!this.state.sharedPlaylists.length
                  ? <CardItem>
                    <Text style={styles.header}>
                      No one has shared any playlists with you yet!
                        </Text>
                  </CardItem>
                  : <View>
                    {this.state.sharedPlaylists.map((playlist, index) => {
                      return (
                        <CardItem
                          button
                          key={index}
                          onPress={() => this.props.goToPlaylist(playlist)}
                        >
                          <Body>
                            <Text style={styles.bodytxt}>
                              {playlist.title}
                            </Text>
                            <Text note style={styles.bodytxt}>
                              Playlist by {playlist.displayName}
                            </Text>
                          </Body>
                          <Right>
                            <Icon
                              name="arrow-forward"
                              style={styles.arrow}
                            />
                          </Right>
                        </CardItem>
                      );
                    })}
                  </View>}
              </View>}
          </Card>
        </Content>
      </Container>
    );
  }
}
