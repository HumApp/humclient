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
      pendingPlaylists: [],
      isLoading: true
    };
  }
  getUserPlaylists = async userId => {
    let playlistArr = [];
    const playlists = await firebase
      .database()
      .ref(`users/${userId}/playlists/`)
      .orderByValue()
      .equalTo('original')
      .once('value');
    for (let playlist in playlists.val()) {
      const result = await Database.getPlaylistFromId(playlist);
      let newPlaylistObj = Object.assign(result.val());
      newPlaylistObj.playlistId = playlist;
      playlistArr.push(newPlaylistObj);
    }
    console.log('returning');
    return playlistArr;
  };

  componentDidMount() {
    const currentUser = firebase.auth().currentUser.uid;
    Promise.resolve(this.getUserPlaylists(currentUser)).then(playlistArr => {
      this.setState(
        { playlists: this.state.playlists.concat(playlistArr) },
        () => this.setState({ isLoading: false })
      )
    }
    )
      .catch(error => console.log("My playlists ", error));
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
                    {this.state.playlists.map((playlist, index) => {
                      return (
                        <CardItem
                          button
                          key={index}
                          onPress={() => this.props.goToPlaylist(playlist)}
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
