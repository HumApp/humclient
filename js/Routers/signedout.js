import React from 'react';
import { StackNavigator } from 'react-navigation';
import Login from '../components/login';
import Signup from '../components/signup';
import Home from '../components/home';
import { Platform, StatusBar } from 'react-native';

export default StackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        header: null
      }
    },

    Signup: {
      screen: Signup,
      navigationOptions: {
        title: 'Signup',
        headerTintColor: '#FC642D',
        headerStyle: {
          backgroundColor: 'white'
        },
        headerTitleStyle: {
          color: '#FC642D'
        }
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        title: 'Login',
        headerTintColor: '#FC642D',
        headerStyle: {
          backgroundColor: 'white'
        },
        headerTitleStyle: {
          color: '#FC642D'
        }
      }
    }
  },
  {
    style: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  }
);
