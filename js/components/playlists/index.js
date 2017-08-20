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
import Database from '../../../utils/database';
import { AsyncStorage } from 'react-native';

export default class Playlists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
      sharedPlaylists: [],
      isLoading: true,
      sharedLoading: true
    };
  }
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  getUserPlaylists = async userId => {
    let playlistArr = [];
    await firebase
      .database()
      .ref(`playlists/`)
      .orderByChild('creator')
      .equalTo(userId)
      .once('value')
      .then(playlists => {
        playlists.forEach(playlist => {
          let newPlaylistObj = Object.assign(playlist.val());
          newPlaylistObj.playlistId = playlist.key;
          playlistArr.push(newPlaylistObj);
        });
      });
    return playlistArr;
  };

  pendingPlaylists = () => {
    this.props.navigation.navigate('PendingPlaylists', this.state.sharedPlaylists);
  };

  savePlaylist = playlistId => {
    const currentUser = firebase.auth().currentUser
    if(currentUser.accessToken) Database.databasePlaylistToSpotify(playlistId)
    else {
      console.log("should save to apple")
      // should get playlist by id and stringify it
      // let applePlaylist = JSON.stringify(obj)
      // NativeModules.MediaLibraryManager.createPlaylist(applePlaylist, (str) => {console.log(str)})
    }
  }


  componentDidMount() {
    const currentUser = firebase.auth().currentUser.uid
    Promise.resolve(this.getUserPlaylists(currentUser))
    .then(playlistArr => this.setState({playlists: this.state.playlists.concat(playlistArr)}, () => this.setState({isLoading: false})))
    Promise.resolve(Database.getSharedPlaylists()).then(result =>
        Object.keys(result.val()).map(key => {
          Promise.resolve(Database.getPlaylistFromId(key)).then(result => {
            let playlistObj = Object.assign(result.val())
            playlistObj.playlistId = key
            this.setState({sharedPlaylists: this.state.sharedPlaylists.concat(playlistObj)})
          })
          }
        ))
  }

  render() {
    // console.log('playlists', firebase.auth().currentUser.displayName);
    console.log("shared playlists", this.state.sharedPlaylists);
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
        <Content>
          {this.state.sharedPlaylists.length ?
          <Card>
            <CardItem button onPress={this.pendingPlaylists} header>
              <Badge style={{ backgroundColor: '#FC642D' }}>
                <Text>{this.state.sharedPlaylists.length}</Text>
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

            {this.state.isLoading ? <Spinner color="#FC642D" /> :
            <View>
            {!this.state.playlists.length
              ?
                <CardItem>
                  <Text style={styles.header}>Connect a music streaming service to view playlists!</Text>
                </CardItem>
              : <View>
                  {this.state.playlists.map((playlist, index) => {
                    return (
                      <CardItem
                        button
                        key={index}
                        onPress={() => this.goToPlaylist(playlist)}
                      >
                        <Body>
                          <Text style={styles.bodytxt}>
                            {playlist.title}
                          </Text>
                        </Body>
                        <Right>
                          <Icon name="arrow-forward" style={styles.arrow} />
                        </Right>
                      </CardItem>
                    );
                  })}
                </View>
              }
              </View>
            }
          </Card>
          <Card>
            <CardItem header>
              <Icon
                active
                name="musical-note"
                style={{ color: '#484848', fontSize: 40 }}
              />
              <Text style={styles.header}>Shared with Me</Text>
            </CardItem>
            {this.state.sharedLoading ? <Spinner color="#FC642D" /> :
            <View>
            {this.state.sharedPlaylists[0] == null ?
              <CardItem >
                  <Text>No one has shared any playlists with you!</Text>
              </CardItem> :
            <View>
            {Object.keys(this.state.sharedPlaylists).map(key => {
              return (
                        <SwipeRow
                          rightOpenValue={-75}
                          body={
                                <CardItem>
                                  <Body>
                                    <Text style={styles.bodytxt}>Beets</Text>
                                    <Text note style={styles.bodytxt}>
                                      Playlist by One June
                                    </Text>
                                  </Body>
                                  <Right>
                                    <Icon name="arrow-forward" style={styles.arrow} />
                                  </Right>
                                </CardItem>
                          }
                          right={
                            <Button primary onPress={() => this.savePlaylist(key)}>
                              <Icon active name="trash" />
                            </Button>
                          }
                          />
                      )
                })
              }
              </View>

              }
              </View>


            }
          </Card>
        </Content>
      </Container>
    );
  }
}
