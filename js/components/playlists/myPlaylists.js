import React, { Component } from 'react';
import * as firebase from 'firebase';
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
  Thumbnail,
  Header,
  Item,
  Input,
  Spinner,
  Badge
} from 'native-base';
import styles from './styles';
import * as Database from '../../../utils/database';
import { AsyncStorage, RefreshControl } from 'react-native';

export default class MyPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      pendingPlaylists: [], //refered to as SharedPlaylists
      compareForRefresh: [],
      isLoading: true,
      searchPlaylist: '',
      refreshing: false
    };
  }

  userPlaylistCallback = async snapshot => {
    let playlists = snapshot.val();
    let temp = [];
    serviceIdArray = [];
    for (let playlistId in playlists) {
      if (playlists[playlistId] === 'original') {
        const tempPlaylist = await Database.getPlaylistFromId(playlistId);
        const playlist = Object.assign({}, tempPlaylist.val(), { playlistId });
        let songArr = []
        if(tempPlaylist.val().songs) songArr = Object.keys(tempPlaylist.val().songs)
        serviceIdArray.push({serviceId: playlist.serviceId, id: playlistId, songs: songArr});
        temp.push(playlist);
      }
    }
    this.setState({ playlists: [], compareForRefresh: [] }, () => {
      this.setState({
        playlists: this.state.playlists.concat(temp),
        compareForRefresh: this.state.compareForRefresh.concat(serviceIdArray),
        isLoading: false
      });
    });
  };

  pendingPlaylistCallback = async snapshot => {
    let playlists = snapshot.val();
    let temp = [];
    for (let playlistId in playlists) {
      const playlist = await Database.getPlaylistFromId(playlistId);
      temp.push(playlist.val());
    }
    this.setState({ pendingPlaylists: [] }, () => {
      this.setState({
        pendingPlaylists: this.state.pendingPlaylists.concat(temp),
        isLoading: false
      });
    });
  };

  _onRefresh() {
    this.setState({ refreshing: true }, () => {
      Database.updateAppleMusic(this.state.compareForRefresh, this.appleUpdateDone);
    });
  }

  appleUpdateDone =  async playlistsIds => {
    const idArr = playlistsIds
    this.setState({ refreshing: false}, async () => {
      for(playlistId of idArr){
        const tempPlaylist = await Database.getPlaylistFromId(playlistId);
        const playlist = Object.assign({}, tempPlaylist.val(), { playlistId });
        let songArr = []
        if(tempPlaylist.val().songs) songArr = Object.keys(tempPlaylist.val().songs)
        let service = {serviceId: playlist.serviceId, id: playlistId, songs: songArr};
        this.setState({playlists: this.state.playlists.map(oldPlaylist => {
          if(oldPlaylist.playlistId === playlist.playlistId) return playlist;
          else return oldPlaylist
        }), compareForRefresh: this.state.compareForRefresh.map(oldPlaylist => {
          console.log(oldPlaylist.id, service.id)
          if(oldPlaylist.id === service.id) return service;
          else return oldPlaylist
        })})
      }
    });
  }

  async componentDidMount() {
    Database.getUserPlaylists().on('value', this.userPlaylistCallback);
    Database.getSharedPlaylists().on('value', this.pendingPlaylistCallback);
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search through your playlists"
              autoCorrect={false}
              autoCapitalize="none"
              value={this.state.searchPlaylist}
              onChangeText={text => this.setState({ searchPlaylist: text })}
            />
            <Icon name="ios-musical-notes" />
          </Item>
        </Header>
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          {this.props.pendingPlaylists.length
            ? <Card>
                <CardItem
                  button
                  onPress={() => this.props.goToPending()}
                  header
                >
                  <Badge style={{ backgroundColor: '#FC642D' }}>
                    <Text>
                      {this.props.pendingPlaylists.length}
                    </Text>
                  </Badge>
                  <Text style={styles.header}> Pending Playlists</Text>
                  <Right>
                    <Icon name="arrow-forward" style={styles.arrow} />
                  </Right>
                </CardItem>
              </Card>
            : null}
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" style={styles.headerIcon} />
              <Text style={styles.header}>Playlists</Text>
            </CardItem>

            {this.state.isLoading
              ? <Spinner color="#FC642D" />
              : <View>
                  {!this.state.playlists.length
                    ? <CardItem>
                        <Text style={styles.header}>
                          Connect a music streaming service to view playlists!
                        </Text>
                      </CardItem>
                    : <View>
                        {this.state.playlists.length !== 0 &&
                          this.state.playlists
                            .filter((playlist, index) =>
                              playlist.title
                                .toLowerCase()
                                .match(this.state.searchPlaylist)
                            )
                            .map((playlist, index) =>
                              <CardItem
                                button
                                key={index}
                                onPress={() =>
                                  this.props.goToPlaylist(playlist, {serviceId: playlist.serviceId, id: playlist.playlistId, songs: Object.keys(playlist.songs)})}
                              >
                                <Body>
                                  <Text style={styles.bodytxt}>
                                    {playlist.title}
                                  </Text>
                                </Body>
                                <Right>
                                  <Icon
                                    name="arrow-forward"
                                    style={styles.arrow}
                                  />
                                </Right>
                              </CardItem>
                            )}
                      </View>}
                </View>}
          </Card>
        </Content>
      </Container>
    );
  }
}
