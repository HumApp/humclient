import React from 'react';
import { StackNavigator } from 'react-navigation';
import Friends from '../components/friends';
import FriendRequests from '../components/friends/friendRequests';

export const FriendsStack = StackNavigator({
  Friends: {
    screen: Friends,
    navigationOptions: {
      title: 'Friends',
      headerStyle: {
        backgroundColor: '#ff5a5f'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  FriendRequests: {
    screen: FriendRequests,
    navigationOptions: {}
  }
});
