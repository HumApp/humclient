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

  goToShare = playlistId => {
    this.props.navigation.navigate('SharePlaylist', playlistId);
  };

  apple = async playlist => {
    this.setState({ appleDownloading: true });
    try {
      playlistObj = { name: playlist.title, author: playlist.displayName };
      const songArr = [];
      for (let song of playlist.songs) {
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
          .catch(error => console.log('Single Playlist ', error));
        if (songNum.data.toString() !== 'ERROR') songArr.push(songNum.data.toString());
      }
      playlistObj.songs = songArr;
      let applePlaylist = JSON.stringify(playlistObj);
      NativeModules.MediaLibraryManager.createPlaylist(applePlaylist, str => {
        this.appleComplete();
      });
    } catch (error) {
      this.appleFailed()
    }
  };

  appleComplete = () => {
    this.setState({ appleDownloading: false }, () => {
      Toast.show({
        text: 'Playlist downloaded to apple music!',
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
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

  spotifyComplete = () => {
    this.setState({ spotifyDownloading: false }, () => {
      Toast.show({
        text: 'Playlist downloaded to spotify!',
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
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

  spotify = playlistId => {
    this.setState({ spotifyDownloading: true }, () => {
      Database.databasePlaylistToSpotify(playlistId, this.spotifyComplete, this.spotifyFailed);
    });
  };

  render() {
    const playlist = this.props.navigation.state.params;
    console.log("SINGLE PLAYLIST", playlist)
    return (
      <Container>
        <Content>
        {this.state.spotifyDownloading || this.state.appleDownloading
                ? <Spinner color="#FC642D" />
                : null}
          <Card>
            <CardItem
              header
              bordered
            >
              <Body>
                <Text style={styles.pheader}>
                  {playlist.title}
                </Text>
                {playlist.type === 'appleId'
                  ? <Text note style={styles.subtitle}>
                      Apple Music Playlist by {playlist.displayName}
                    </Text>
                  : <Text note style={styles.subtitle}>
                      Spotify Playlist by {playlist.displayName}
                    </Text>}
              </Body>

              {this.state.spotifyAuth && playlist.type === 'appleId'
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

              {this.state.appleAuth && playlist.type === 'spotifyId'
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
                      onPress={() => this.apple(playlist)}
                    >
                      <FAIcon name="apple" size={25} color="#FF4B63" />
                    </Button>
                : null}
              <Button
                light
                style={{ margin: 5 }}
                small
                disabled={this.state.appleDownloading || this.state.spotifyDownloading}
                onPress={() => this.goToShare(playlist.playlistId)}
              >
                <Icon name="ios-share-outline" style={styles.headerIcon} />
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
                  {Object.keys(playlist.songs).map((song, index) => {
                    return (
                      <ListItem key={index} avatar bordered key={index}>
                        <Left>
                          <Thumbnail
                            square
                            size={80}
                            source={{ uri: `${playlist.songs[song].image}` }}
                          />
                        </Left>
                        <Body>
                          <Text style={styles.bodytxt}>
                            {playlist.songs[song].title}
                          </Text>
                          <Text note style={styles.bodytxt}>
                            {playlist.songs[song].artist}
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
