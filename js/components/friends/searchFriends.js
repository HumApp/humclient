import React, { Component } from 'react';
import {
  Container,
  Content,
  Icon,
  Button,
  Text,
  Card,
  View,
  Body,
  Item,
  Spinner,
  Input,
  CardItem,
  Badge,
  Header,
  Right,
  Left,
  SwipeRow
} from 'native-base';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
const SpotifyModule = NativeModules.SpotifyModule;
import styles from './styles';

export default class SearchFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      requests: [{ username: 'oliviaoddo' }, { username: 'brian' }]
    };
  }

  componentWillMount() {
    // Promise.resolve(Database.getAllUsers()).then(result => this.setState({results: this.state.results.concat(result.val())}))
    Promise.resolve(Database.getAllUsers()).then(result =>
      this.setState({ results: result.val() })
    );
  }

  addRequest = (name, requestedFriendId) => {
    console.log(requestedFriendId);
    Database.requestFriend(requestedFriendId);
    Toast.show({
      text: `Friend request sent to ${name}!`,
      position: 'bottom',
      duration: 1500,
      type: 'success'
    });
  };

  render() {
    return (
      <Content>
        <Card>
          <CardItem header>
            <Text style={styles.header}> Search Results</Text>
          </CardItem>
          {!this.state.results
            ? <Spinner color="#FC642D" />
            : <View>
                {Object.keys(this.state.results).map((friendKey, index) => {
                  return (
                    <CardItem key={index} bordered={true}>
                      <Body>
                        <Text style={styles.bodytxt}>
                          {this.state.results[friendKey].fullname}
                        </Text>
                        <Text style={styles.bodytxt}>
                          {this.state.results[friendKey].username}
                        </Text>
                      </Body>
                      <Right>
                        <Button
                          small
                          style={{ backgroundColor: '#ff5a5f' }}
                          onPress={() =>
                            this.addRequest(
                              this.state.results[friendKey].fullname,
                              friendKey
                            )}
                        >
                          <Icon name="md-add" />
                        </Button>
                      </Right>
                    </CardItem>
                  );
                })}
              </View>}
        </Card>
      </Content>
    );
  }
}
