import PlaylistsStack from './playlists';
import CollabStack from './collab';
import FriendsStack from './friends';
import ProfileStack from './profile';
import React from 'react';
import {
  TabNavigator,
  StackNavigator,
  TabBarBottom,
  NavigationActions
} from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import { Icon } from 'native-base';

const Tabs = TabNavigator(
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
      activeTintColor: '#ff5a5f',
      inactiveTintColor: '#cecece',
      style: {
        paddingTop: 10
      }
    },
    initialRouteName: 'Friends',
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

export default StackNavigator(
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
