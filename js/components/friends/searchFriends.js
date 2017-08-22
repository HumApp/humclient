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
      searchedUsers: null,
      searchName: '',
      isLoading: false
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

  fetchSearchUsers = async () => {
    try {
      this.setState({ isLoading: true });
      const searchedUsers = await Database.getUsersByAnyName(
        this.state.searchName
      );
      this.setState({ searchedUsers }, () =>
        this.setState({ isLoading: false })
      );
    } catch (err) {
      Toast.show({
        text: `${err}!`,
        position: 'bottom',
        duration: 1500,
        type: 'success'
      });
    }
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
              value={this.state.searchName}
              onChangeText={text => this.setState({ searchName: text })}
            />
            <Icon name="ios-people" />
          </Item>
          <Button transparent onPress={this.fetchSearchUsers}>
            <Text>Search</Text>
          </Button>
        </Header>
        <Card>
          <CardItem header>
            <Text style={styles.header}> Search Results</Text>
          </CardItem>
          {this.state.isLoading
            ? <Spinner color="#FC642D" />
            : <View>
                {!this.state.searchedUsers
                  ? <CardItem>
                      <Text>Search for friends to add them!</Text>
                    </CardItem>
                  : <View>
                      {Object.keys(
                        this.state.searchedUsers
                      ).map((userId, index) => {
                        return (
                          <CardItem key={index} bordered={true}>
                            <Body>
                              <Text style={styles.bodytxt}>
                                {this.state.searchedUsers[userId].fullname}
                              </Text>
                              <Text style={styles.bodytxt}>
                                {this.state.searchedUsers[userId].username}
                              </Text>
                            </Body>
                            <Right>
                              <Button
                                small
                                style={{ backgroundColor: '#ff5a5f' }}
                                onPress={() =>
                                  this.addRequest(
                                    this.state.searchedUsers[userId].fullname,
                                    userId
                                  )}
                              >
                                <Icon name="md-add" />
                              </Button>
                            </Right>
                          </CardItem>
                        );
                      })}
                    </View>}
              </View>}
        </Card>
      </Content>
    );
  }
}
