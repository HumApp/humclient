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
import { AsyncStorage } from 'react-native';

export default class MyPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      pendingPlaylists: [], //refered to as SharedPlaylists
      isLoading: true,
      searchPlaylist: ''
    };
  }
  // getUserPlaylists = async userId => {
  //   let playlistArr = [];
  //   const playlists = await firebase
  //     .database()
  //     .ref(`users/${userId}/playlists/`)
  //     .orderByValue()
  //     .equalTo('original')
  //     .once('value');
  //   for (let playlist in playlists.val()) {
  //     const result = await Database.getPlaylistFromId(playlist);
  //     let newPlaylistObj = Object.assign(result.val());
  //     newPlaylistObj.playlistId = playlist;
  //     playlistArr.push(newPlaylistObj);
  //   }
  //   console.log('returning');
  //   return playlistArr;
  // };

  userPlaylistCallback = async snapshot => {
    let playlists = snapshot.val();
    let temp = [];
    for (let playlistId in playlists) {
      const tempPlaylist = await Database.getPlaylistFromId(playlistId);
      const playlist = Object.assign({}, tempPlaylist.val(), { playlistId });
      temp.push(playlist);
    }
    this.setState({ playlists: [] }, () => {
      console.log('userPlaylists:', temp);
      this.setState(
        { playlists: this.state.playlists.concat(temp), isLoading: false },
        () => {
          console.log('executed');
        }
      );
    });
  };

  pendingPlaylistCallback = async snapshot => {
    let playlists = snapshot.val();
    let temp = [];
    for (let playlistId in playlists) {
      const playlist = await Database.getPlaylistFromId(playlistId);
      temp.push(playlist.val());
    }
    console.log('pendingPlaylists:', temp);
    this.setState({ pendingPlaylists: [] }, () => {
      this.setState({
        pendingPlaylists: this.state.pendingPlaylists.concat(temp),
        isLoading: false
      });
    });
  };

  async componentDidMount() {
    console.log('MOUNTED');
    Database.getUserPlaylists().on('value', this.userPlaylistCallback);
    Database.getSharedPlaylists().on('value', this.pendingPlaylistCallback);
    //Database.getSharedPlaylists().on('value', this.playlistCallback);
    // const currentUser = firebase.auth().currentUser.uid;
    // Promise.resolve(this.getUserPlaylists(currentUser)).then(playlistArr => {
    //   this.setState(
    //     { playlists: this.state.playlists.concat(playlistArr) },
    //     () => this.setState({ isLoading: false })
    //   )
    // }
    // )
    //   .catch(error => console.log("My playlists ", error));
    // Database.getSharedPlaylists()
    //   .then(result =>
    //     Object.keys(result.val()).map(key => {
    //       Promise.resolve(Database.getPlaylistFromId(key)).then(result => {
    //         let playlistObj = Object.assign(result.val());
    //         playlistObj.playlistId = key;
    //         this.setState({
    //           pendingPlaylists: this.state.sharedPlaylists.concat(playlistObj)
    //         });
    //       })
    //         .catch(error => console.log("My playlists ", error));
    //     })
    //   ).catch(error => console.log("My playlists ", error));
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
        <Content>
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
                        {this.state.playlists
                          .filter((playlist, index) =>
                            playlist.title
                              .toLowerCase()
                              .match(this.state.searchPlaylist)
                          )
                          .map((playlist, index) => {
                            {
                              console.log('Playlist.map', playlist, index);
                            }
                            return (
                              <CardItem
                                button
                                key={index}
                                onPress={() =>
                                  this.props.goToPlaylist(playlist)}
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
                            );
                          })}
                      </View>}
                </View>}
          </Card>
        </Content>
      </Container>
    );
  }
}
