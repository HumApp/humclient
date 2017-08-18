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
  Spinner,
  Toast
} from 'native-base';
import styles from './styles';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
const SpotifyModule = NativeModules.SpotifyModule;

export default class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      requests: [{username: "oliviaoddo"}, {username: "brian"}]
    };
  }

  componentWillMount() {
    // Promise.resolve(Database.getAllUsers()).then(result => this.setState({results: this.state.results.concat(result.val())}))
    Promise.resolve(Database.getAllUsers()).then(result => this.setState({results: result.val()}))
  }

  addRequest = (requestedFriendId) => {
    console.log(requestedFriendId)
    Database.requestFriend(requestedFriendId)
  }

  acceptRequest = (username) => {
    console.log("accepted")
    this.setState({requests: this.state.requests.filter(person => username != person.username)})
    Toast.show({text: 'Friend added!', position: 'bottom', duration: 1500, type: 'success'})

  }

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <Header searchBar rounded>
              <Item>
                <Icon name="ios-search" />
                <Input placeholder="Search for new friends" />
              </Item>
              <Button
                light
                onPress={() => console.log('clear')}
                transparent>
                <Icon name="md-close-circle" />
              </Button>
            </Header>
            <CardItem header>
              <Text style={styles.header}> Search Results</Text>
            </CardItem>
            {!this.state.results ? <Spinner /> :
              <View>
                {Object.keys(this.state.results).map(friendKey => {
                  return (
                          <SwipeRow
                            rightOpenValue={-75}
                            key={friendKey}
                            body={
                              <CardItem>
                                <Body>
                                  <Text style={styles.bodytxt}>{this.state.results[friendKey].fullname}</Text>
                                  <Text style={styles.bodytxt}>{this.state.results[friendKey].username}</Text>
                                </Body>
                                <Right>

                                </Right>
                              </CardItem>
                            }
                            right={
                              <Button primary onPress={() => this.addRequest(friendKey)}>
                                <Icon active name="md-add-circle" />
                              </Button>
                            }
                            />
                          )
                })}
              </View>
            }
          </Card>
        </Content>
      </Container>
    );
  }
}
