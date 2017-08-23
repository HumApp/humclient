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
  View,
  Badge,
  Header,
  Item,
  Input,
  Toast,
  Thumbnail,
  Spinner
} from 'native-base';
import styles from './styles';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import * as Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
const SpotifyModule = NativeModules.SpotifyModule;

export default class PendingPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: this.props.navigation.state.params,
      appleAuth: false,
      spotifyAuth: null,
      spotifyDownloading: false,
      appleDownloading: false
    };
  }

  goToPlaylist = playlist => {
    this.props.navigation.navigate('ViewPlaylistRequest', {playlist: playlist, goBackToAll: this.goBackAllPlaylists, requests: this.state.requests, filterRequests: this.filterRequests});
  };

  goBackAllPlaylists = () => {
    this.props.navigation.goBack()
  };

  filterRequests = playlistId => {
    this.setState({requests: this.state.requests.filter(playlist => {
        return playlist.playlistId != playlistId
    })})
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
      });
  }

  deleteRequest = playlistId => {
    Database.unfollowPlaylist(playlistId);
    this.setState(
      {
        requests: this.state.requests.filter(
          playlist => playlistId != playlist.playlistId
        )
      },
      () => {
        if (!this.state.requests.length) this.props.navigation.goBack();
      }
    );
    Toast.show({
      text: 'Playlist request deleted!',
      position: 'bottom',
      duration: 1500,
      type: 'danger'
    });
  };

  spotify = playlistId => {
    Database.addPlaylistFromPending(playlistId);
    this.setState({ spotifyDownloading: true }, () => {
      Database.databasePlaylistToSpotify(
        playlistId,
        this.spotifyComplete,
        this.spotifyFailed
      );
    });
  };

  spotifyComplete = playlistId => {
    this.setState({ spotifyDownloading: false }, () => {
      Toast.show({
        text: 'Playlist downloaded to spotify!',
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
      this.setState(
        {
          requests: this.state.requests.filter(
            playlist => playlistId != playlist.playlistId
          )
        },
        () => {
          if (!this.state.requests.length) this.props.navigation.goBack();
        }
      );
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
      Database.addPlaylistFromPending(playlistId);
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
        songArr.push(songNum.data.toString());
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

  appleComplete = playlistId => {
    this.setState({ appleDownloading: false }, () => {
      Toast.show({
        text: 'Playlist downloaded to apple music!',
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
      this.setState(
        {
          requests: this.state.requests.filter(
            playlist => playlistId != playlist.playlistId
          )
        },
        () => {
          if (!this.state.requests.length) this.props.navigation.goBack();
        }
      );
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
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" style={styles.headerIcon} />
              <Text style={styles.header}>Requests</Text>
            </CardItem>
            {this.state.requests.map(playlist => {
              return (
                <SwipeRow
                  rightOpenValue={-75}
                  key={playlist.playlistId}
                  body={
                    <CardItem
                      button
                      onPress={() => {
                        this.goToPlaylist(playlist);
                      }}

                    >
                      <Body>
                        <Text>
                          {playlist.title}
                        </Text>
                        <Text note>
                          Playlist by {playlist.displayName}
                        </Text>
                        <Text note>
                          {playlist.songs.length} songs
                        </Text>
                      </Body>
                      {this.state.spotifyAuth
                        ? !this.state.spotifyDownloading
                          ? <Button
                              small
                              light
                              style={{ margin: 5 }}
                              onPress={() => this.spotify(playlist.playlistId)}
                            >
                              <FAIcon
                                name="spotify"
                                size={25}
                                color="#1db954"
                              />
                            </Button>
                          : <Button small light style={{ margin: 5 }}>
                              <Spinner color="#1db954" />
                            </Button>
                        : null}
                      {this.state.appleAuth
                        ? !this.state.appleDownloading
                          ? <Button
                              small
                              light
                              style={{ margin: 5 }}
                              onPress={() => this.apple(playlist.playlistId)}
                            >
                              <FAIcon name="apple" size={25} color="#FF4B63" />
                            </Button>
                          : <Button small light style={{ margin: 5 }}>
                              <Spinner color="#FF4B63" />
                            </Button>
                        : null}
                    </CardItem>
                  }
                  right={
                    <Button
                      danger
                      onPress={() => this.deleteRequest(playlist.playlistId)}
                    >
                      <Icon active name="md-close-circle" />
                    </Button>
                  }
                />
              );
            })}
          </Card>
        </Content>
      </Container>
    );
  }
}
