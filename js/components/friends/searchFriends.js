import React, { Component } from 'react';
import {
  Container,
  Content,
  Icon,
  Button,
  Text,
  Card,
  View,
  Body,
  Item,
  Spinner,
  Header,
  Input,
  CardItem,
  Badge,
  Right,
  Left,
  Toast,
  SwipeRow
} from 'native-base';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import * as Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
const SpotifyModule = NativeModules.SpotifyModule;
import styles from './styles';

export default class SearchFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      requests: [{ username: 'oliviaoddo' }, { username: 'brian' }],
      searchFriend: ''
    };
  }

  addRequest = (name, requestedFriendId) => {
    console.log(requestedFriendId);
    Database.requestFriend(requestedFriendId);
    Toast.show({
      text: `Friend request sent to ${name}!`,
      position: 'bottom',
      duration: 1500,
      type: 'success'
    });
  };

  searchNewFriends = searchFriend => {
    Database.request;
  };

  render() {
    return (
      <Content>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              placeholder="Search for new friends"
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.searchFriend}
              onChangeText={text => this.setState({ searchFriend: text })}
            />
          </Item>
          <Button
            transparent
            onPress={() => this.searchNewFriends(this.state.searchFriend)}
          >
            <Text>Search</Text>
          </Button>
        </Header>
        <Card>
          <CardItem header>
            <Text style={styles.header}> Search Results</Text>
          </CardItem>
          {!this.state.results
            ? <Spinner color="#FC642D" />
            : <View>
                {Object.keys(this.state.results).map((friendKey, index) => {
                  return (
                    <CardItem key={index} bordered={true}>
                      <Body>
                        <Text style={styles.bodytxt}>
                          {this.state.results[friendKey].fullname}
                        </Text>
                        <Text style={styles.bodytxt}>
                          {this.state.results[friendKey].username}
                        </Text>
                      </Body>
                      <Right>
                        <Button
                          small
                          style={{ backgroundColor: '#ff5a5f' }}
                          onPress={() =>
                            this.addRequest(
                              this.state.results[friendKey].fullname,
                              friendKey
                            )}
                        >
                          <Icon name="md-add" />
                        </Button>
                      </Right>
                    </CardItem>
                  );
                })}
              </View>}
        </Card>
      </Content>
    );
  }
}
