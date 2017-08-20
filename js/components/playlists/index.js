import React, { Component } from 'react';
import { Container, Header, Content, Tab, Tabs, Item, Icon, Input, Button, Text, Card, CardItem, Badge, Right } from 'native-base';
import MyPlaylists from './myPlaylists';
import SharedPlaylists from './sharedPlaylists';
import * as firebase from 'firebase';
import Database from '../../../utils/database';
import { AsyncStorage } from 'react-native';



export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingPlaylists: []
    }
  }
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  goToPendingPlaylists = () => {
    this.props.navigation.navigate(
      'PendingPlaylists',
      this.state.pendingPlaylists
    );
  };

  componentDidMount() {
    const currentUser = firebase.auth().currentUser.uid;
    Promise.resolve(Database.getSharedPlaylists()).then(result =>
      Object.keys(result.val()).map(key => {
        Promise.resolve(Database.getPlaylistFromId(key)).then(result => {
          let playlistObj = Object.assign(result.val());
          playlistObj.playlistId = key;
          this.setState({
            pendingPlaylists: this.state.pendingPlaylists.concat(playlistObj)
          });
        });
      })
    );
  }

  render() {

    return (
      <Container>
         <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <Tabs tabBarUnderlineStyle={{backgroundColor: '#ff5a5f'}} initialPage={0}>
          <Tab activeTextStyle={{color: "#484848"}} heading="My Playlists">
            <MyPlaylists goToPending={this.goToPendingPlaylists} goToPlaylist={this.goToPlaylist} pendingPlaylists={this.state.pendingPlaylists}/>
          </Tab>
          <Tab activeTextStyle={{color: "#484848"}} heading="Shared Playlists">
            <SharedPlaylists goToPending={this.goToPendingPlaylists} goToPlaylist={this.goToPlaylist} pendingPlaylists={this.state.pendingPlaylists}/>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
