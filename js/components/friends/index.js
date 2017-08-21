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
  Tabs,
  Tab,
  Card,
  CardItem,
  SwipeRow,
  View,
  Badge,
  Header,
  Spinner,
  Item,
  Input,
  Toast
} from 'native-base';
import styles from './styles';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import * as Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
import MyFriends from './myFriends';
import SearchFriends from './searchFriends';
const SpotifyModule = NativeModules.SpotifyModule;

export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      pending: [],
      isLoading: true
    };
  }

  handleSearch = (friends) => {
    // friends.filter(friend => {
    //   return friend.match(this.state.)
    // })
    console.log('hi brian');

  };

  friendRequests = () => {
    this.props.navigation.navigate('FriendRequests', this.state.pending);
  };

  searchPeople = () => {
    this.props.navigation.navigate('SearchResults');
  };

  async componentDidMount() {
    const pendingFriends = await Database.getPendingFriends();
    for (let friendId in pendingFriends.val()) {
      console.log('friendId', friendId);
      const user = {};
      const pendingFriend = await Database.getUserFromId(friendId);
      user.username = pendingFriend.val().username;
      user.fullname = pendingFriend.val().fullname;
      user.userId = friendId;
      this.setState({ pending: this.state.pending.concat(user) }, () =>
        console.log('pending...', this.state.pending)
      );
    }

    const friends = await Database.getAllFriends();
    let friendsArr = [];
    for (let friendId in friends.val()) {
      friendsArr.push({
        friendId: friendId,
        friendName: friends.val()[friendId]
      });
    }
    this.setState({ friends: this.state.friends.concat(friendsArr) }, () =>
      this.setState({ isLoading: false })
    );
  }

  deleteFriend = friendId => {
    Database.deleteFriend(friendId);
    console.log('deleted');
    this.setState({
      friends: this.state.friends.filter(person => friendId != person.friendId)
    });
    Toast.show({
      text: 'Request deleted!',
      position: 'bottom',
      duration: 1500,
      type: 'danger'
    });
  };

  render() {
    console.log('friends', this.state.friends);

    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search for new friends" />
          </Item>
          <Button light onPress={this.searchPeople} transparent>
            <Icon name="md-close-circle" />
          </Button>
        </Header>
        <Tabs
          tabBarUnderlineStyle={{ backgroundColor: '#ff5a5f' }}
          initialPage={0}
        >
          <Tab activeTextStyle={{ color: '#484848' }} heading="My Friends">
            <MyFriends
              handleSearch={this.handleSearch}
              friends={this.state.friends}
              pending={this.state.pending}
              loading={this.state.loading}
            />
          </Tab>
          <Tab activeTextStyle={{ color: '#484848' }} heading="Search Friends">
            <SearchFriends
              handleSearch={this.handleSearch}
              friends={this.state.friends}
              pending={this.state.pending}
              loading={this.state.loading}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
