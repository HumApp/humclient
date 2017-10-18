import React, { Component } from 'react';
import {
  Container,
  Header,
  Content,
  Tab,
  Tabs,
  Item,
  Icon,
  Input,
  Button,
  Text,
  Card,
  CardItem,
  Badge,
  Right
} from 'native-base';
import MyPlaylists from './myPlaylists';
import SharedPlaylists from './sharedPlaylists';
import * as firebase from 'firebase';
import * as Database from '../../../utils/database';
import { AsyncStorage } from 'react-native';

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingPlaylists: []
    };
  }

  componentDidMount() {
    const currentUser = firebase.auth().currentUser.uid;
    Database.getSharedPlaylists().on('value', this.pendingCallback);
  }

  goToPlaylist = (playlist, compare) => {
    this.props.navigation.navigate('SinglePlaylist', {playlist: playlist, compare: compare});
  };

  goToSharedPlaylist = playlist => {
    this.props.navigation.navigate('SingleSharedPlaylist', playlist);
  };

  goToPendingPlaylists = () => {
    this.props.navigation.navigate(
      'PendingPlaylists',
      this.state.pendingPlaylists
    );
  };

  pendingCallback = async snap => {
    const pendingRequests = snap.val();
    const temp = [];
    for (const key in pendingRequests) {
      const playlistFromId = await Database.getPlaylistFromId(key);
      let playlistObj = Object.assign({}, playlistFromId.val());
      playlistObj.playlistId = key;
      temp.push(playlistObj);
    }
    this.setState({ pendingPlaylists: [] }, () => {
      this.setState({
        pendingPlaylists: this.state.pendingPlaylists.concat(temp)
      });
    });
  };

  render() {
    return (
      <Container>
        <Tabs
          tabBarUnderlineStyle={{ backgroundColor: '#ff5a5f' }}
          initialPage={0}
        >
          <Tab activeTextStyle={{ color: '#484848' }} heading="My Playlists">
            <MyPlaylists
              goToPending={this.goToPendingPlaylists}
              goToPlaylist={this.goToPlaylist}
              pendingPlaylists={this.state.pendingPlaylists}
            />
          </Tab>
          <Tab
            activeTextStyle={{ color: '#484848' }}
            heading="Shared Playlists"
          >
            <SharedPlaylists
              goToPending={this.goToPendingPlaylists}
              goToPlaylist={this.goToSharedPlaylist}
              pendingPlaylists={this.state.pendingPlaylists}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
