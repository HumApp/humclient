import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Left,
  Body,
  Icon,
  Text,
  Right,
  List,
  ListItem,
  Card,
  CardItem,
  SwipeRow,
  View,
  Badge,
  Header,
  Item,
  Input,
  Toast
} from 'native-base';
import styles from './styles';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import { NativeModules, AsyncStorage } from 'react-native';
import axios from 'axios';
import Database from '../../../utils/database';
import Prompt from 'react-native-prompt';
import firebase from 'firebase';
const SpotifyModule = NativeModules.SpotifyModule;

export default class FriendRequests extends Component {
  constructor(props) {
    super(props);

  }

  deleteRequest = (usernameId) => {
    Database.rejectFriendFromPending(usernameId)
    // this.setState({requests: this.state.requests.filter(person => username != person.username)})
    Toast.show({text: 'Request deleted!', position: 'bottom', duration: 1500, type: 'danger'})
  }

  acceptRequest = (usernameId) => {
    Database.addFriendFromPending(usernameId)
    // this.setState({requests: this.state.requests.filter(person => username != person.username)})
    Toast.show({text: 'Friend added!', position: 'bottom', duration: 1500, type: 'success'})

  }

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="md-people" style={styles.headerIcon} />
              <Text style={styles.header}>Requests</Text>
            </CardItem>
            {this.props.navigation.state.params.map(friendId => {
              return(
                <SwipeRow
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  key={friendId}
                  left={
                    <Button success onPress={() => this.acceptRequest(Object.keys(friendId)[0])}>
                      <Icon active name="md-add-circle" />
                    </Button>
                  }
                  body={
                    <CardItem>
                      <Body>
                        <Text style={styles.bodytxt}>{Object.keys(friendId)[0]}</Text>
                      </Body>
                      <Right>

                      </Right>
                    </CardItem>
                  }
                  right={
                    <Button danger onPress={() => this.deleteRequest(Object.keys(friendId)[0])}>
                      <Icon active name="md-close-circle" />
                    </Button>
                  }
                  />
                )
            })}
          </Card>
        </Content>
      </Container>
    );
  }
}
