import { StackNavigator } from 'react-navigation';
import Collab from '../components/collab';
import React from 'react';

export const CollabStack = StackNavigator({
  Collab: {
    screen: Collab,
    navigationOptions: {
      title: 'Collab',
      headerStyle: {
        backgroundColor: '#ff5a5f'
      },
      headerTitleStyle: {
        color: 'white'
      }
    }
  }
});
