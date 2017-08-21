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
      requests: this.props.navigation.state.params
    }

  }

  deleteRequest = (userId) => {
    Database.rejectFriendFromPending(userId)
    this.setState({requests: this.state.requests.filter(person => userId != person.userId)}, () => {
        if(!this.state.requests.length) this.props.navigation.goBack()
    })
    Toast.show({text: 'Request deleted!', position: 'bottom', duration: 1500, type: 'danger'})
  }

  acceptRequest = (userId) => {
    Database.addFriendFromPending(userId)
    this.setState({requests: this.state.requests.filter(person => userId != person.userId)}, () => {
         if(!this.state.requests.length) this.props.navigation.goBack()
    })
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
                   <CardItem bordered key={friend.userId}>
                      <Body>
                        <Text>{friend.fullname}</Text>
                        <Text note >@{friend.username}</Text>
                      </Body>
                        {/* OB/TL: consider moving styles to file (like in other places) */}
                        <Button small style={{backgroundColor: "#FC642D", margin: 5}} onPress={() => this.acceptRequest(friend.userId)}>
                                <Icon name="ios-add" />
                          </Button>
                        <Button small danger style={{margin: 5}} onPress={() => this.deleteRequest(friend.userId)}>
                                <Icon name="ios-close" />
                        </Button>

                    </CardItem>

                )
            })}
          </Card>
        </Content>
      </Container>
    );
  }
}
