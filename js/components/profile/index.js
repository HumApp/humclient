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
  Spinner,
  CardItem,
  SwipeRow,
  View
} from 'native-base';
import styles from './styles';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules } from 'react-native';
import axios from 'axios';
import * as Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import * as firebase from 'firebase';
const Buffer = require('buffer/').Buffer;
const querystring = require('querystring');

const SpotifyModule = NativeModules.SpotifyModule;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: '',
      promptVisible: false,
      token: '',
      id: '',
      usersPlaylists: {},
      appleAuth: false,
      name: '',
      username: '',
      refreshToken: ''
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}`)
      .once('value')
      .then(snapshot => {
        this.setState({
          username: firebase.auth().currentUser.displayName,
          name: snapshot.val().fullname,
          id: snapshot.val().spotifyId,
          token: snapshot.val().accessToken,
          appleAuth: snapshot.val().appleAuth,
          refreshToken: snapshot.val().refreshToken
        });
      })
      .catch(error => console.log('Profile ', error));
  }

  signOut = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate('SignedOut');
    } catch (err) {
      Toast.show({
        text: `${err}`,
        position: 'top',
        buttonText: 'Okay',
        duration: 2000
      });
    }
  };

  authSpotify = () => {
    try {
      SpotifyModule.authenticate(data => {
        console.log(data);
        this.setState({ token: data.accessToken, refreshToken: data.refreshToken }, this.whoamI);
      });
    } catch (err) {
      console.error('Spotify authentication failed: ', err);
    }
  };

  whoamI = () => {
    axios
      .get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${this.state.token}`
        }
      })
      .then(response => {
        this.setState({ id: response.data.id }, this.saveUserInfoToDatabase);
      })
      .catch(error => console.log(error));
  };

  persistAppleMusic = () => {
    let appleAuth = true;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/' + user.uid).update({
          appleAuth
        });
      } else {
      }
    });
  };

  saveUserInfoToDatabase = () => {
    let accessToken = this.state.token;
    let spotifyId = this.state.id;
    let refreshToken = this.state.refreshToken;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/' + user.uid).update({
          accessToken,
          spotifyId,
          refreshToken
        });
      } else {
      }
    });
    this.fetchPlaylists();
  };

  fetchPlaylists = async () => {
    try {
      const responseData = await axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${this.state.token}`
          }
        }
      );
      const returnedPlaylist = responseData.data;
      returnedPlaylist.items.forEach(async item => {
        let playlist = {};
        playlist.name = item.name;
        let songsData = await axios
          .get(`${item.tracks.href}`, {
            headers: {
              Authorization: `Bearer ${this.state.token}`
            }
          })
          .catch(error => console.log('Profile ', error));
        let songs = songsData.data.items;
        let songsArr = [];
        songs.forEach(song => {
          let songObj = {};
          songObj.title = song.track.name;
          songObj.image =
            !song.track.album.images ||
            !song.track.album ||
            !song.track.album.images[0]
              ? 'https://orig01.deviantart.net/26aa/f/2011/185/f/9/no_cover_itunes_by_stainless2-d3kxnbe.png'
              : song.track.album.images[0].url;
          songObj.artist = song.track.album.artists[0].name;
          songObj.id = song.track.uri;
          songsArr.push(songObj);
        });
        playlist.songs = songsArr;
        Database.savePlaylistToDatabase([playlist], 'spotifyId');
      });
    } catch (error) {
      console.log(error);
    }
  };

  requestMediaLibrary = () => {
    NativeModules.AuthorizationManager.requestMediaLibraryAuthorization(str => {
      this.setState({ appleAuth: true }, () => this.getPlaylists());
    });
  };

  requestAppleMusic = () => {
    NativeModules.AuthorizationManager.requestCloudServiceAuthorization(
      this.requestMediaLibrary
    );
  };

  getPlaylists = () => {
    NativeModules.MediaLibraryManager.getPlaylists(playlists => {
      Database.savePlaylistToDatabase(JSON.parse(playlists), 'appleId');
      this.persistAppleMusic();
    });
  };

  appleConnected = () => {
    if (this.state.appleAuth)
      return (
        <Icon name="ios-checkmark-circle" style={styles.headerIcondisabled} />
      );
    else return <Icon name="ios-add" style={styles.header} />;
  };

  disconnectApple = () => {
    let appleAuth = false;
    this.setState({ appleAuth: false });
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/' + user.uid).update({
          appleAuth
        });
        Database.deleteAllUserPlaylists(user.uid, 'appleId');
      } else {
        console.log('No user is signed in');
      }
    });
  };

  disconnectSpotify = () => {
    let accessToken = '';
    let spotifyId = '';
    this.setState({ token: accessToken, id: spotifyId });
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/' + user.uid).update({
          accessToken,
          spotifyId
        });
        Database.deleteAllUserPlaylists(user.uid, 'spotifyId');
      } else {
        console.log('No user is signed in');
      }
    });
  };

  newToken = () => {
    var data = querystring.stringify({ 'refresh_token': `${this.state.refreshToken}` });
    axios
      .post('https://us-central1-hum-app.cloudfunctions.net/refresh',
      data)
      .then(response => console.log(response.data.access_token))
      .catch(error => console.log('error: ', error))
  }

  render() {
    return (
      <Container>
        {this.state.name
          ? <Content>
              <Card>
                <CardItem header>
                  <Icon active name="ios-person" style={styles.headerIcon} />
                  <Text style={styles.header}>Personal Information</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.bodytxt}>Name</Text>
                  </Body>
                  <Right>
                    <Text style={styles.bodytxt}>
                      {this.state.name}
                    </Text>
                  </Right>
                </CardItem>
                <CardItem>
                  <Body>
                    <Text style={styles.bodytxt}>Username</Text>
                  </Body>
                  <Right>
                    <Text style={styles.bodytxt}>
                      {this.state.username}
                    </Text>
                  </Right>
                </CardItem>
              </Card>
              <Card>
                <CardItem header>
                  <Icon
                    active
                    name="ios-musical-notes"
                    style={styles.headerIcon}
                  />
                  <Text style={styles.header}>Integrations</Text>
                </CardItem>

                {this.state.appleAuth
                  ? <SwipeRow
                      rightOpenValue={-75}
                      body={
                        <CardItem disabled>
                          <Left>
                            <FAIcon name="apple" size={25} color="#FF4B63" />
                          </Left>
                          <Body>
                            <Text style={styles.bodytxtdisabled}>
                              Apple Music
                            </Text>
                          </Body>
                          <Right>
                            {this.appleConnected()}
                          </Right>
                        </CardItem>
                      }
                      right={
                        <Button danger onPress={this.disconnectApple}>
                          <Icon active name="md-close-circle" />
                        </Button>
                      }
                    />
                  : <SwipeRow
                      body={
                        <CardItem
                          button
                          onPress={
                            this.state.appleAuth
                              ? console.log('already authorized')
                              : this.requestAppleMusic
                          }
                        >
                          <Left>
                            <FAIcon name="apple" size={25} color="#FF4B63" />
                          </Left>
                          <Body>
                            <Text style={styles.bodytxt}>Apple Music</Text>
                          </Body>
                          <Right>
                            {this.appleConnected()}
                          </Right>
                        </CardItem>
                      }
                    />}

                {this.state.token
                  ? <SwipeRow
                      rightOpenValue={-75}
                      body={
                        <CardItem disabled>
                          <Left>
                            <FAIcon name="spotify" size={25} color="#1db954" />
                          </Left>
                          <Body>
                            <Text style={styles.bodytxtdisabled}>Spotify</Text>
                          </Body>
                          <Right>
                            {this.state.token
                              ? <Icon
                                  name="ios-checkmark-circle"
                                  style={styles.headerIcondisabled}
                                />
                              : <Icon name="ios-add" style={styles.header} />}
                          </Right>
                        </CardItem>
                      }
                      right={
                        <Button danger onPress={this.disconnectSpotify}>
                          <Icon active name="md-close-circle" />
                        </Button>
                      }
                    />
                  : <SwipeRow
                      body={
                        <CardItem
                          button
                          onPress={
                            this.state.token
                              ? () => console.log('already authorized')
                              : this.authSpotify
                          }
                        >
                          <Left>
                            <FAIcon name="spotify" size={25} color="#1db954" />
                          </Left>
                          <Body>
                            <Text style={styles.bodytxt}>Spotify</Text>
                          </Body>
                          <Right>
                            {this.state.token
                              ? <Icon
                                  name="ios-checkmark-circle"
                                  style={styles.header}
                                />
                              : <Icon name="ios-add" style={styles.header} />}
                          </Right>
                        </CardItem>
                      }
                    />}
                <SwipeRow
                  rightOpenValue={-75}
                  body={
                    <CardItem>
                      <Left>
                        <FAIcon name="youtube-play" size={25} color="#FF0404" />
                      </Left>
                      <Body>
                        <Text style={styles.bodytxt}>Youtube</Text>
                      </Body>
                      <Right>
                        <Icon
                          onPress={() => console.log('hello')}
                          name="ios-add"
                          style={styles.header}
                        />
                      </Right>
                    </CardItem>
                  }
                  right={
                    <Button danger onPress={() => console.log('Coming soon!')}>
                      <Icon active name="ios-close-circle-outline" />
                    </Button>
                  }
                />
              </Card>
              <Card>
                <CardItem header>
                  <Icon active name="ios-settings" style={styles.headerIcon} />
                  <Text style={styles.header}>Settings</Text>
                </CardItem>
                <CardItem
                  button
                  onPress={() =>
                    this.props.navigation.navigate('UpdatePassword')}
                >
                  <Body>
                    <Text style={styles.bodytxt}>Update Password</Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" style={styles.arrow} />
                  </Right>
                </CardItem>
                <CardItem button onPress={this.signOut}>
                  <Body>
                    <Text style={styles.bodytxt}>Sign Out</Text>
                  </Body>
                  <Right>
                    <Icon name="arrow-forward" style={styles.arrow} />
                  </Right>
                </CardItem>
              </Card>
            </Content>
          : <Spinner color="#FC642D" />}
      </Container>
    );
  }
}
