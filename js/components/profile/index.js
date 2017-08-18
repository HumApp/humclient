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
import Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import * as firebase from 'firebase';
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
      username: ''
    };
  }

  componentDidMount() {
    console.log("Mounting...")
    firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}`)
      .once('value')
      .then(snapshot => {
        this.setState({
          username: firebase.auth().currentUser.displayName,
          name: snapshot.val().fullname,
          id: snapshot.val().spotifyId,
          token: snapshot.val().accessToken
        }, () => console.log(this.state.username, this.state.id, this.state.token, snapshot));
      });
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
        this.setState({ token: data.accessToken }, this.whoamI);
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

  saveUserInfoToDatabase = () => {
    let accessToken = this.state.token;
    let spotifyId = this.state.id;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user);
        firebase.database().ref('users/' + user.uid).update({
          accessToken,
          spotifyId
        });
      } else {
        console.log('No user is signed in');
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
        let songsData = await axios.get(`${item.tracks.href}`, {
          headers: {
            Authorization: `Bearer ${this.state.token}`
          }
        });
        let songs = songsData.data.items;
        let songsArr = [];
        songs.forEach(song => {
          let songObj = {};
          songObj.title = song.track.name;
          songObj.image = (!song.track.album.images || !song.track.album || !song.track.album.images[0]) ? "https://orig01.deviantart.net/26aa/f/2011/185/f/9/no_cover_itunes_by_stainless2-d3kxnbe.png" : song.track.album.images[0].url;
          console.log(songObj.image);
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

  createPlaylists = () => {
    axios
      .post(
      `https://api.spotify.com/v1/users/${this.state.id}/playlists`,
      `{\"name\":\"${this.state.playlist}\", \"public\":false}`,
      {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
          'Content-Type': 'application/json'
        }
      }
      )
      .catch(error => console.log(error));
  };

  requestAppleMusic = () => {
    NativeModules.AuthorizationManager.requestMediaLibraryAuthorization(str => {
      this.setState({ appleAuth: true }, () => this.getPlaylists());
    });
  };

  getPlaylists = () => {
    NativeModules.MediaLibraryManager.getPlaylists(playlists => {
      Database.savePlaylistToDatabase(JSON.parse(playlists), 'appleId');
    });
  };

  appleConnected = () => {
    if (this.state.appleAuth)
      return <Icon name="ios-checkmark-circle" style={styles.header} />;
    else return <Icon name="ios-add" style={styles.header} />;
  };

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
              <SwipeRow
                rightOpenValue={-75}
                body={
                  <CardItem button onPress={(this.state.appleAuth) ? console.log("already authorized") : this.requestAppleMusic}>
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
                right={
                  <Button danger onPress={() => alert('Trash')}>
                    <Icon active name="ios-close-circle-outline" />
                  </Button>
                }
              />
              <SwipeRow
                rightOpenValue={-75}
                body={
                  <CardItem button onPress={(this.state.token) ? () => console.log("already authorized") : this.authSpotify}>
                    <Left>
                      <FAIcon name="spotify" size={25} color="#1db954" />
                    </Left>
                    <Body>
                      <Text style={styles.bodytxt}>Spotify</Text>
                    </Body>
                    <Right>
                      {(this.state.token) ? (<Icon name="ios-checkmark-circle" style={styles.header} />) : (<Icon name="ios-add" style={styles.header} />)}
                    </Right>
                  </CardItem>
                }
                right={
                  <Button
                    danger
                    onPress={() => this.setState({ id: '', token: '' })}
                  >
                    <Icon active name="ios-close-circle-outline" />
                  </Button>
                }
              />
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
              <Prompt
                title="Enter a playlist name"
                placeholder="My New Playlist"
                visible={this.state.promptVisible}
                onCancel={() => this.setState({ promptVisible: false })}
                onSubmit={value =>
                  this.setState(
                    { promptVisible: false, playlist: `${value}` },
                    this.createPlaylists
                  )}
              />
              <CardItem
                button
                onPress={() => this.setState({ promptVisible: true })}
              >
                <Body>
                  <Text style={styles.bodytxt}>New Spotify Playlist</Text>
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
