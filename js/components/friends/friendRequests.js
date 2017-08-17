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
    this.state = {
      requests: [{username: "oliviaoddo"}, {username: "brian"}]
    };
  }

  deleteRequest = (username) => {
    console.log('deleted')
    this.setState({requests: this.state.requests.filter(person => username != person.username)})
    Toast.show({text: 'Request deleted!', position: 'bottom', duration: 1500, type: 'danger'})
  }

  acceptRequest = (username) => {
    console.log("accepted")
    this.setState({requests: this.state.requests.filter(person => username != person.username)})
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
            {this.state.requests.map(friend => {
              return(
                <SwipeRow
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  key={friend.username}
                  left={
                    <Button success onPress={() => this.acceptRequest(friend.username)}>
                      <Icon active name="md-add-circle" />
                    </Button>
                  }
                  body={
                    <CardItem>
                      <Body>
                        <Text style={styles.bodytxt}>{friend.username}</Text>
                      </Body>
                      <Right>

                      </Right>
                    </CardItem>
                  }
                  right={
                    <Button danger onPress={() => this.deleteRequest(friend.username)}>
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