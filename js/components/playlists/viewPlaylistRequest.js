import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Left,
  Body,
  Grid,
  Row,
  Col,
  Icon,
  Text,
  Right,
  List,
  ListItem,
  Card,
  CardItem,
  Thumbnail,
  View,
  Spinner,
  Toast
} from 'native-base';
import styles from './styles';
import axios from 'axios';
import * as Database from '../../../utils/database';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules } from 'react-native';
import firebase from 'firebase';
export default class SinglePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appleAuth: false,
      spotifyAuth: '',
      spotifyDownloading: false,
      appleDownloading: false
    };
  }
  componentDidMount() {
    firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}`)
      .once('value')
      .then(snapshot => {
        this.setState({
          spotifyAuth: snapshot.val().accessToken,
          appleAuth: snapshot.val().appleAuth
        });
      })
      .catch(error => console.log('Single Playlist ', error));
  }

  deleteRequest = playlistId => {
    Database.unfollowPlaylist(playlistId);
    Toast.show({
      text: 'Playlist request deleted!',
      position: 'bottom',
      duration: 1500,
      type: 'danger'
    });
    if (this.props.navigation.state.params.requests.length === 1)
      this.props.navigation.state.params.goBackToAll();
    else {
      this.props.navigation.state.params.filterRequests(playlistId);
      this.props.navigation.goBack();
    }
  };

  spotify = playlistId => {
    this.setState({ spotifyDownloading: true }, () => {
      Database.databasePlaylistToSpotify(
        playlistId,
        this.spotifyComplete,
        this.spotifyFailed
      );
    });
  };

  spotifyComplete = () => {
    Database.addPlaylistFromPending(playlistId);
    this.setState({ spotifyDownloading: false }, () => {
      Toast.show({
        text: 'Playlist downloaded to spotify!',
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
      if (this.props.navigation.state.params.requests.length === 1)
        this.props.navigation.state.params.goBackToAll();
      else {
        this.props.navigation.state.params.filterRequests(playlistId);
        this.props.navigation.goBack();
      }
    });
  };

  spotifyFailed = () => {
    this.setState({ spotifyDownloading: false }, () => {
      Toast.show({
        text: 'Unable to download spotify playlist.',
        position: 'bottom',
        duration: 1500,
        type: 'danger'
      });
    });
  };

  apple = async playlistId => {
    this.setState({ appleDownloading: true });
    try {
      let playlistObj = null;
      let songArr = [];
      let result = await Database.getPlaylistFromId(playlistId);
      playlistObj = {
        name: result.val().title,
        author: result.val().displayName
      };
      for (let song of result.val().songs) {
        let songNum = await axios
          .post(
            'https://us-central1-hum-app.cloudfunctions.net/getSongId/',
            {
              title: `${song.title}`,
              artist: `${song.artist}`,
              service: 'appleId'
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          .catch(error => console.log('Pending Playlists ', error));
        if (songNum.data.toString() !== 'ERROR') songArr.push(songNum.data.toString());
      }
      playlistObj.songs = songArr;
      let applePlaylist = JSON.stringify(playlistObj);
      NativeModules.MediaLibraryManager.createPlaylist(applePlaylist, str => {
        this.appleComplete(playlistId);
      });
    } catch (err) {
      this.appleFailed()
    }
  };

  appleComplete = (playlistId) => {
    Database.addPlaylistFromPending(playlistId);
    this.setState({ appleDownloading: false }, () => {
      Toast.show({
        text: 'Playlist downloaded to apple music!',
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
      if (this.props.navigation.state.params.requests.length === 1)
        this.props.navigation.state.params.goBackToAll();
      else {
        this.props.navigation.state.params.filterRequests(playlistId);
        this.props.navigation.goBack();
      }
    });
  };

  appleFailed = () => {
    this.setState({ appleDownloading: false }, () => {
      Toast.show({
        text: 'Unable to download playlist to apple music.',
        position: 'bottom',
        duration: 1500,
        type: 'danger'
      });
    });
  };

  render() {
    const playlist = this.props.navigation.state.params.playlist;
    return (
      <Container>
        <Content>
        {this.state.spotifyDownloading || this.state.appleDownloading
                ? <Spinner color="#FC642D" />
                : null}
          <Card>
            <CardItem header bordered>
              <Body>
                <Text style={styles.pheader}>
                  {playlist.title}
                </Text>
                <Text note style={styles.subtitle}>
                  Playlist by {playlist.displayName}
                </Text>
              </Body>
              {this.state.spotifyAuth
                ? this.state.spotifyDownloading || this.state.appleDownloading
                  ? <Button
                      small
                      light
                      style={{ margin: 5 }}
                     disabled
                    >
                      <FAIcon name="spotify" size={25} color="#1db954" />
                    </Button>
                  : <Button
                      small
                      light
                      style={{ margin: 5 }}
                      onPress={() => this.spotify(playlist.playlistId)}
                    >
                      <FAIcon name="spotify" size={25} color="#1db954" />
                    </Button>
                : null}
              {this.state.appleAuth
                ? this.state.appleDownloading || this.state.spotifyDownloading
                  ? <Button
                      small
                      light
                      style={{ margin: 5 }}
                      disabled
                    >
                      <FAIcon name="apple" size={25} color="#FF4B63" />
                    </Button>
                  : <Button
                      small
                      light
                      style={{ margin: 5 }}
                      onPress={() => this.apple(playlist.playlistId)}
                    >
                      <FAIcon name="apple" size={25} color="#FF4B63" />
                    </Button>
                : null}
              <Button
                danger
                style={{ margin: 5 }}
                small
                disabled={this.state.spotifyDownloading || this.state.appleDownloading}
                onPress={() => this.deleteRequest(playlist.playlistId)}
              >
                <Icon name="md-close-circle" />
              </Button>
            </CardItem>
            <CardItem header>
              <Body>
                <Text style={styles.songHeader}>Songs</Text>
              </Body>
            </CardItem>
            {!playlist.songs
              ? <ListItem>
                  <Body>
                    <Text>This playlist doesn't contain any songs.</Text>
                  </Body>
                </ListItem>
              : <View>
                  {playlist.songs.map((song, index) => {
                    return (
                      <ListItem key={index} avatar bordered key={index}>
                        <Left>
                          <Thumbnail
                            square
                            size={80}
                            source={{ uri: `${song.image}` }}
                          />
                        </Left>
                        <Body>
                          <Text style={styles.bodytxt}>
                            {song.title}
                          </Text>
                          <Text note style={styles.bodytxt}>
                            {song.artist}
                          </Text>
                        </Body>
                      </ListItem>
                    );
                  })}
                </View>}

            <CardItem />
          </Card>
        </Content>
      </Container>
    );
  }
}
