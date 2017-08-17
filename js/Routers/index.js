import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import { Icon } from 'native-base';

import Login from '../components/login';
import Signup from '../components/signup';
import Home from '../components/home';

import Playlists from '../components/playlists';
import SinglePlaylist from '../components/playlists/singlePlaylist';
import SharePlaylist from '../components/playlists/sharePlaylist';


import Collab from '../components/collab';
import Friends from '../components/friends';
import Profile from '../components/profile';
import UpdatePassword from '../components/profile/updatePassword';

export const PlaylistsStack = StackNavigator({
  Playlists: {
    screen: Playlists,
    navigationOptions: {
      title: 'Playlists'
    }
  },
  SinglePlaylist: {
    screen: SinglePlaylist,
    navigationOptions: {}
  },
   SharePlaylist: {
    screen: SharePlaylist,
    navigationOptions: {
      title: 'Share Playlist'
    }
  }
});

export const CollabStack = StackNavigator({
  Collab: {
    screen: Collab,
    navigationOptions: {
      title: 'Collab'
    }
  }
});

export const FriendsStack = StackNavigator({
  Friends: {
    screen: Friends,
    navigationOptions: {
      title: 'Friends'
    }
  }
});

export const ProfileStack = StackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile'
    }
  },
  UpdatePassword: {
    screen: UpdatePassword,
    navigationOptions: {}
  }
});

export const Tabs = TabNavigator({
  Playlists: {
    screen: PlaylistsStack,
    navigationOptions: {
      tabBarLabel: 'Playlists',
      tabBarIcon: ({ tintColor }) =>
        <Icon name="ios-musical-notes" style={{ fontSize: 35, color: tintColor }} />
    }
  },
  Collab: {
    screen: CollabStack,
    navigationOptions: {
      tabBarLabel: 'Collab',
      tabBarIcon: ({ tintColor }) =>
        <Icon name="md-headset" style={{ fontSize: 35, color: tintColor }} />
    }
  },
  Friends: {
    screen: FriendsStack,
    navigationOptions: {
      tabBarLabel: 'Friends',
      tabBarIcon: ({ tintColor }) =>
        <Icon name="md-people" style={{ fontSize: 35, color: tintColor }} />
    }
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="md-person" style={{ fontSize: 35, color: tintColor }} />)
    }
  }
}, {
    tabBarOptions: {
      activeTintColor: '#ff5a5f',
      inactiveTintColor: '#cecece'
    },
  });

export const SignedOut = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {}
  },

  Signup: {
    screen: Signup,
    navigationOptions: {
      title: ''
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: ''
    }
  }
});

export const SignedIn = StackNavigator(
  {
    Tabs: {
      screen: Tabs
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    style: {
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    }
  }
);

export const createRootNavigator = (signedIn = true) => {
  return StackNavigator(
    {
      SignedIn: {
        screen: SignedIn,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      SignedOut: {
        screen: SignedOut,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: 'none',
      mode: 'modal',
      initialRouteName: signedIn ? 'SignedIn' : 'SignedOut'
    }
  );
};
