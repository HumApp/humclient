import React from 'react';
import { StackNavigator } from 'react-navigation';
import Playlists from '../components/playlists';
import SinglePlaylist from '../components/playlists/singlePlaylist';
import SharePlaylist from '../components/playlists/sharePlaylist';
import PendingPlaylists from '../components/playlists/pendingPlaylists';
import MyPlaylists from '../components/playlists/myPlaylists';
import SharedPlaylists from '../components/playlists/sharedPlaylists';
import SingleSharedPlaylist from '../components/playlists/singleSharedPlaylist';
import ViewPlaylistRequest from '../components/playlists/viewPlaylistRequest';

export const PlaylistsStack = StackNavigator({
  Playlists: {
    screen: Playlists,
    navigationOptions: {
      title: 'Playlists',
      headerStyle: {
        backgroundColor: '#ff5a5f'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  SharedPlaylists: {
    screen: SharedPlaylists,
    navigationOptions: {
      title: 'Playlists'
    }
  },
  MyPlaylists: {
    screen: MyPlaylists,
    navigationOptions: {
      title: 'Playlists'
    }
  },
  SinglePlaylist: {
    screen: SinglePlaylist,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#ff5a5f'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  SingleSharedPlaylist: {
    screen: SingleSharedPlaylist,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#ff5a5f'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  },
  ViewPlaylistRequest: {
    screen: ViewPlaylistRequest,
    navigationOptions: {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#ff5a5f'
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
        backgroundColor: '#ff5a5f'
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
        backgroundColor: '#ff5a5f'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  }
});
