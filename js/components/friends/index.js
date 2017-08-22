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
      searchFriends: [],
      pending: [],
      isLoading: true
    };
  }

  searchMyFriends = searchFriend => {
    this.setState({
      searchFriends: searchFriend
        ? this.state.friends.filter(friend =>
            friend.friendName.toLowerCase().match(searchFriend)
          )
        : this.state.friends
    });
  };

  searchNewFriends = searchFriend => {
    this.setState({
      searchFriends: searchFriend
        ? this.state.friends.filter(friend =>
            friend.friendName.match(searchFriend)
          )
        : this.state.friends
    });
  };

  friendRequests = () => {
    this.props.navigation.navigate('FriendRequests', this.state.pending);
  };

  searchPeople = () => {
    this.props.navigation.navigate('SearchResults');
  };

  pendingCallback = async snap => {
    const pendingFriends = snap.val();
    const temp = [];
    for (let friendId in pendingFriends) {
      const user = {};
      const pendingFriend = await Database.getUserFromId(friendId);
      console.log('friendId', friendId);
      console.log('frieENDNDN', pendingFriend.val());
      user.username = pendingFriend.val().username;
      user.fullname = pendingFriend.val().fullname;
      user.userId = friendId;
      temp.push(user);
    }
    console.log('TEMO', temp);
    this.setState({ pending: [] }, () => {
      this.setState({ pending: this.state.pending.concat(temp) });
    });
  };

  friendsCallback = async snap => {
    console.log('beginning of friends callback');
    let friendsArr = [];
    for (let friendId in snap.val()) {
      console.log('friend id', friendId);
      friendsArr.push({
        friendId: friendId,
        friendName: snap.val()[friendId]
      });
    }

    this.setState({ friends: [], searchFriends: [] }, () => {
      this.setState(
        {
          friends: this.state.friends.concat(friendsArr),
          searchFriends: this.state.friends.concat(friendsArr)
        },
        () => this.setState({ isLoading: false })
      );
    });
  };

  async componentDidMount() {
    Database.getPendingFriends().on('value', this.pendingCallback);
    Database.getAllFriends().on('value', this.friendsCallback);
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
        <Tabs
          tabBarUnderlineStyle={{ backgroundColor: '#ff5a5f' }}
          initialPage={0}
          locked
        >
          <Tab activeTextStyle={{ color: '#484848' }} heading="My Friends">
            <MyFriends
              searchMyFriends={this.searchMyFriends}
              goToPending={this.friendRequests}
              friends={this.state.searchFriends}
              pending={this.state.pending}
              isLoading={this.state.isLoading}
              deleteFriend={this.deleteFriend}
            />
          </Tab>
          <Tab activeTextStyle={{ color: '#484848' }} heading="Search Friends">
            <SearchFriends
              searchNewFriends={this.searchNewFriends}
              handleSearch={this.handleSearch}
              friends={this.state.friends}
              pending={this.state.pending}
              isLoading={this.state.isLoading}
            />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
