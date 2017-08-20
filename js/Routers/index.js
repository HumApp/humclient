import React from 'react';
import {
  TabNavigator,
  StackNavigator,
  TabBarBottom,
  NavigationActions
} from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import { Icon } from 'native-base';

import Login from '../components/login';
import Signup from '../components/signup';
import Home from '../components/home';

import Playlists from '../components/playlists';
import SinglePlaylist from '../components/playlists/singlePlaylist';
import SharePlaylist from '../components/playlists/sharePlaylist';
import PendingPlaylists from '../components/playlists/pendingPlaylists';

import Collab from '../components/collab';
import Friends from '../components/friends';
import FriendRequests from '../components/friends/friendRequests';
import SearchResults from '../components/friends/searchResults';

import Profile from '../components/profile';
import UpdatePassword from '../components/profile/updatePassword';

export const PlaylistsStack = StackNavigator({
  Playlists: {
    screen: Playlists,
    navigationOptions: {
      title: 'Playlists',
      headerStyle: {
        backgroundColor: '#0fc3bd'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  SinglePlaylist: {
    screen: SinglePlaylist,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#0fc3bd'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  SharePlaylist: {
    screen: SharePlaylist,
    navigationOptions: {
      title: 'Share Playlist',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#0fc3bd'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  PendingPlaylists: {
    screen: PendingPlaylists,
    navigationOptions: {
      title: 'Pending Playlists',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#0fc3bd'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  }
});

export const CollabStack = StackNavigator({
  Collab: {
    screen: Collab,
    navigationOptions: {
      title: 'Collab',
      headerStyle: {
        backgroundColor: '#0fc3bd'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  }
});

export const FriendsStack = StackNavigator({
  Friends: {
    screen: Friends,
    navigationOptions: {
      title: 'Friends',
      headerStyle: {
        backgroundColor: '#0fc3bd'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  FriendRequests: {
    screen: FriendRequests,
    navigationOptions: {}
  },
  SearchResults: {
    screen: SearchResults,
    navigationOptions: {}
  }
});

export const ProfileStack = StackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
      headerStyle: {
        backgroundColor: '#0fc3bd'
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
        backgroundColor: '#0fc3bd'
      }
    }
  }
});

export const Tabs = TabNavigator(
  {
    Playlists: {
      screen: PlaylistsStack,
      navigationOptions: {
        tabBarLabel: 'Playlists',
        tabBarIcon: ({ tintColor }) =>
          <Icon
            name="ios-musical-notes"
            style={{ fontSize: 35, color: tintColor }}
          />
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
        tabBarIcon: ({ tintColor }) =>
          <Icon name="md-person" style={{ fontSize: 35, color: tintColor }} />
      }
    }
  },
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: '#06db77',
      inactiveTintColor: '#cecece'
    },
    initialRouteName: 'Profile',
    navigationOptions: ({ navigation }) => ({
      tabBarOnPress: (tab, jumpToIndex) => {
        if (tab.focused) {
          // if tab currently focused tab
          if (tab.route.index !== 0) {
            // if not on first screen of the StackNavigator in focused tab.
            navigation.dispatch(
              NavigationActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({
                    routeName: tab.route.routes[0].routeName
                  }) // go to first screen of the StackNavigator
                ]
              })
            );
          }
        } else {
          jumpToIndex(tab.index); // go to another tab (the default behavior)
        }
      }
    })
  }
);

export const SignedOut = StackNavigator(
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
        headerTintColor: '#06db77',
        headerStyle: {
          backgroundColor: 'white'
        },
        headerTitleStyle: {
          color: '#06db77'
        }
      }
    },
    Login: {
      screen: Login,
      navigationOptions: {
        title: 'Login',
        headerTintColor: '#06db77',
        headerStyle: {
          backgroundColor: 'white'
        },
        headerTitleStyle: {
          color: '#06db77'
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

export const createRootNavigator = signedIn => {
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
