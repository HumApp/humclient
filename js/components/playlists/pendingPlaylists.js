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
  Thumbnail
} from 'native-base';
import styles from './styles';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
const SpotifyModule = NativeModules.SpotifyModule;

export default class PendingPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: this.props.navigation.state.params
    };
  }

  deleteRequest = (playlistId) => {
    this.setState({requests: this.state.requests.filter(playlist => playlistId != playlist.playlistId)}, () => {if(!this.state.requests.length) this.props.navigation.goBack()})
    Toast.show({text: 'Playlist request deleted!', position: 'bottom', duration: 1500, type: 'danger'})
  }

  spotify = (playlistId) => {
    Database.addPlaylistFromPending(playlistId);
    Database.databasePlaylistToSpotify(playlistId)
    this.setState({requests: this.state.requests.filter(playlist => playlistId != playlist.playlistId)}, () => {if(!this.state.requests.length) this.props.navigation.goBack()})
    Toast.show({text: 'Playlist added!', position: 'bottom', duration: 1500, type: 'success'})

  }

   // let obj = { name: 'Fullstack', author: 'One June', songs: [ '736211860', '712330693', '897279570']}

  apple = (playlistId) => {
    let playlistObj = null
    let songArr = []
    Database.addPlaylistFromPending(playlistId);
    Promise.resolve(Database.getPlaylistFromId(playlistId)).then(result => {
      playlistObj = {name: result.val().title, author: result.val().displayName}
      Promise.resolve(result.val().songs.forEach(song => {
              console.log("cloud function")
              await axios.post(
              'https://us-central1-hum-app.cloudfunctions.net/getSongId/',
              {
                title: `${song.title}`,
                artist: `${song.artist}`,
                service: 'appleId',
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            ).then(result => {console.log(result); songArr.push(result.data.toString())})
      })).then(() => {playlistObj.songs = songArr; console.log(playlistObj)})

      // let applePlaylist = JSON.stringify(result.val())
      // NativeModules.MediaLibraryManager.createPlaylist(applePlaylist, (str) => {console.log(str)})
    })
    // let applePlaylist = JSON.stringify(obj)
    // NativeModules.MediaLibraryManager.createPlaylist(applePlaylist, (str) => {console.log(str)})
    // this.setState({requests: this.state.requests.filter(playlist => playlistId != playlist.playlistId)}, () => {if(!this.state.requests.length) this.props.navigation.goBack()})
    // Toast.show({text: 'Playlist added!', position: 'bottom', duration: 1500, type: 'success'})

  }

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
              return(
                    <CardItem bordered key={playlist.playlistId}>
                      <Body>
                        <Text>{playlist.title}</Text>
                        <Text note >Playlist by {playlist.displayName}</Text>
                        <Text note >{playlist.songs.length} songs</Text>
                      </Body>

                        <Button small light style={{margin: 5}} onPress={() => this.spotify(playlist.playlistId)}>
                                <FAIcon name="spotify" size={25} color="#1db954" />
                          </Button>
                        <Button small light style={{margin: 5}} onPress={() => this.apple(playlist.playlistId)}>
                                <FAIcon name="apple" size={25} color="#FF4B63" />
                        </Button>

                    </CardItem>
                )
            })}
          </Card>
        </Content>
      </Container>
    );
  }
}
