import React from 'react';
import { StackNavigator } from 'react-navigation';
import SignedIn from './signedin';
import SignedOut from './signedout';

export const createRootNavigator = signedIn => {
  return signedIn
    ? StackNavigator(
        {
          SignedIn: {
            screen: SignedIn,
            navigationOptions: {
              gesturesEnabled: false
            }
          }
        },
        {
          headerMode: 'none',
          mode: 'modal'
        }
      )
    : StackNavigator(
        {
          SignedOut: {
            screen: SignedOut,
            navigationOptions: {
              gesturesEnabled: false
            }
          }
        },
        {
          headerMode: 'none',
          mode: 'modal'
        }
      );
};
