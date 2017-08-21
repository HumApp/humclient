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
  Toast
} from 'native-base';
import styles from './styles';
import axios from 'axios';
import Database from '../../../utils/database';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules } from 'react-native';
import firebase from 'firebase';
export default class SinglePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appleAuth: false,
      spotifyAuth: ''
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
      });
  }

  goToShare = playlistId => {
    this.props.navigation.navigate('SharePlaylist', playlistId);
  };

  apple = async playlist => {
    console.log(playlist);
    try {
      playlistObj = { name: playlist.title, author: playlist.displayName };
      const songArr = [];
      Toast.show({
        text: 'Playlist downloaded to apple music!',
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
      for (let song of playlist.songs) {
        let songNum = await axios.post(
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
        );
        songArr.push(songNum.data.toString());
      }
      playlistObj.songs = songArr;
      let applePlaylist = JSON.stringify(playlistObj);
      NativeModules.MediaLibraryManager.createPlaylist(applePlaylist, (str) => {console.log(str)})
    } catch (error) {
      console.log(error);
    }
  };

  spotify = playlistId => {
    Database.databasePlaylistToSpotify(playlistId);
    Toast.show({
      text: 'Playlist downloaded to spotify!',
      position: 'bottom',
      duration: 1500,
      type: 'success'
    });
  };

  render() {
    const playlist = this.props.navigation.state.params;
    return (
      <Container>
        <Content>
          <Card>
            <CardItem
              button
              header
              onPress={() => this.goToShare(playlist.playlistId)}
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
                ? <Button
                    small
                    light
                    style={{ margin: 5 }}
                    onPress={() => this.spotify(playlist.playlistId)}
                  >
                    <FAIcon name="spotify" size={25} color="#1db954" />
                  </Button>
                : null}
              {this.state.appleAuth && playlist.type === 'spotifyId'
                ? <Button
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
