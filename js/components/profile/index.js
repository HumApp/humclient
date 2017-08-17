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
import styles from './styles';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
const SpotifyModule = NativeModules.SpotifyModule;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    //this state object is temporary until I'm done testing.
    this.state = {
      playlist: '',
      promptVisible: false,
      token: '',
      id: '',
      usersPlaylists: {},
      appleAuth: false
    };
  }

  signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
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
        this.setState({ id: response.data.id }, this.fetchPlaylists);
      })
      .catch(error => console.log(error));
  };

  fetchPlaylists = async () => {
    try {
      let playlistArr = [];
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
        const songsData = await axios.get(`${item.tracks.href}`, {
          headers: {
            Authorization: `Bearer ${this.state.token}`
          }
        });
        let songs = songsData.data.items;
        let songsArr = [];
        songs.forEach(song => {
          let songObj = {};
          songObj.title = song.track.name;
          songObj.artist = song.track.album.artists[0].name;
          songObj.id = song.track.uri;
          songsArr.push(songObj);
        });
        playlist.songs = songsArr;
        playlistArr.push(playlist);
        Database.savePlaylistToDatabase(playlistArr, 'spotifyId');
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

  importPlaylist = () => {
    //import Playlist will take a playlist object or an id by querying database for the playlist
    //hard coded example for now
    // const sampleDatabase = firebase.database().ref('playlists/IDHERE');
    // sampleDatabase.on('value', function (snapshot) {
    //   const samplePlaylist = snapshot.val();
    //   console.log(samplePlaylist)
    // });

    let playlist = {
      name: 'Sample Playlist',
      owner: 'Apple Music User',
      songs: [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M'
      ]
    };

    axios
      .post(
        `https://api.spotify.com/v1/users/${this.state.id}/playlists`,
        `{\"name\":\"${playlist.name}\", \"public\":false, \"description\":\"Hum playlist created by ${playlist.owner}\"}`,
        {
          headers: {
            Authorization: `Bearer ${this.state.token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      .then(response => {
        let playlistID = response.data.id;
        axios
          .post(
            `https://api.spotify.com/v1/users/${this.state
              .id}/playlists/${playlistID}/tracks`,
            { uris: playlist.songs },
            {
              headers: {
                Authorization: `Bearer ${this.state.token}`,
                'Content-Type': 'application/json'
              }
            }
          )
          .then(response => this.fetchPlaylists)
          .catch(error => console.log(error));
      })
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
    let obj = {
          name: "please work",
          author: "olivia",
          songs: ["684545030","684539426","684545032","964987819","684545034"]
        }
    let applePlaylist = JSON.stringify(obj);
    return (
      <Container>
        <Content>
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
                <Text style={styles.bodytxt}>SomeUser</Text>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={styles.bodytxt}>Username</Text>
              </Body>
              <Right>
                <Text style={styles.bodytxt}>@SomeUser</Text>
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" style={styles.headerIcon} />
              <Text style={styles.header}>Integrations</Text>
            </CardItem>
            <SwipeRow
              rightOpenValue={-75}
              body={
                <CardItem button onPress={this.requestAppleMusic}>
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
                <CardItem button onPress={this.authSpotify}>
                  <Left>
                    <FAIcon name="spotify" size={25} color="#1db954" />
                  </Left>
                  <Body>
                    <Text style={styles.bodytxt}>Spotify</Text>
                  </Body>
                  <Right>
                    {this.state.id === ''
                      ? <Icon name="ios-add" style={styles.header} />
                      : <Icon
                          name="ios-checkmark-circle"
                          style={styles.header}
                        />}
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
                <Button danger onPress={() => alert('Trash')}>
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
              onPress={() => this.props.navigation.navigate('UpdatePassword')}
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
                <Text style={styles.bodytxt}>Create a Playlist</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow} />
              </Right>
            </CardItem>
            <CardItem button onPress={this.importPlaylist}>
              <Body>
                <Text style={styles.bodytxt}>Import Playlist</Text>
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
            <CardItem
              button
              onPress={() => {
                NativeModules.MediaLibraryManager.createPlaylist(
                  applePlaylist,
                  str => {
                    console.log(str);
                  }
                );
              }}
            >
              <Body>
                <Text style={styles.bodytxt}>Create apple Playlist</Text>
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

// importPlaylist = () => {

//       let samplePlaylist = { "name": "A Sample Playlist", "songs": [{ "artist": "Drake", "track": "Controlla", "album": "Views" }], "creator": "Apple Music User" };

//       axios.post(
//         `https://api.spotify.com/v1/users/${this.state.id}/playlists`,
//         `{\"name\":\"${samplePlaylist.name}\", \"public\":false}`,
//         {
//           headers: {
//             "Authorization": `Bearer ${this.state.token}`,
//             "Content-Type": "application/json"
//           }
//         }
//       )
//         .then(response => {
//           let songURI = '';
//           let playlistID = response.data.id;
//           samplePlaylist.songs.forEach(song => {
//             axios.get(
//               `https://api.spotify.com/v1/search?q=album:${song.album}%20artist:${song.artist}&type=album&limit=1`,
//               {
//                 headers: {
//                   "Authorization": `Bearer ${this.state.token}`
//                 }
//               }
//             )
//               .then(response => {
//                 let sampleAlbum = response.data.albums.items[0].id;
//                 axios.get(
//                   `https://api.spotify.com/v1/albums/${sampleAlbum}/tracks`,
//                   {
//                     headers: {
//                       "Authorization": `Bearer ${this.state.token}`
//                     }
//                   }
//                 )
//                   .then(response => {
//                     let sampleTracks = response.data.items;
//                     for (let i = 0; i < sampleTracks.length; i++) {
//                       if (sampleTracks[i].name === song.track) {
//                         songURI = sampleTracks[i].uri;
//                         break
//                       }
//                     };
//                     axios.post(
//                       `https://api.spotify.com/v1/users/${this.state.id}/playlists/${playlistID}/tracks`,
//                       { "uris": [`${songURI}`] },
//                       {
//                         headers: {
//                           "Authorization": `Bearer ${this.state.token}`,
//                           "Content-Type": "application/json"
//                         }
//                       })
//                       .catch(error => console.log(error))
//                   })
//                   .catch(error => console.log(error))
//               })
//               .catch(error => console.log(error))
//           });
//         })
//         .catch(error => console.log(error))
//     };
