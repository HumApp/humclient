import React from 'react';
import { StackNavigator } from 'react-navigation';
import Profile from '../components/profile';
import UpdatePassword from '../components/profile/updatePassword';

export default StackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
      headerStyle: {
        backgroundColor: '#ff5a5f'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#ff5a5f'
      }
    }
  }
});
