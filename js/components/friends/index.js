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
  Spinner,
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

export default class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: [],
      pending: []
    };
  }

  friendRequests = () => {
    this.props.navigation.navigate('FriendRequests', this.state.pending);
  };

  searchPeople = () => {
    this.props.navigation.navigate('SearchResults');
  }

  componentDidMount() {
    Promise.resolve(Database.getPendingFriends()).then(result => {
      this.setState({pending: this.state.pending.concat(result.val())})
    })
    Promise.resolve(Database.getAllFriends()).then(result => {
      this.setState({friends: this.state.friends.concat(result.val())}, console.log(Object.keys(this.state.friends)))
    })
  }

  deleteFriend = username => {
    console.log('deleted');
    this.setState({
      friends: this.state.friends.filter(person => username != person.username)
    });
    Toast.show({
      text: 'Request deleted!',
      position: 'bottom',
      duration: 1500,
      type: 'danger'
    });
  };

  render() {
    console.log(this.state.friends)
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search for new friends" />
          </Item>
          <Button
            light
            onPress={this.searchPeople}
            transparent
          >
            <Icon name="md-close-circle" />
          </Button>
        </Header>
        <Content>
          <Card>
            <CardItem button onPress={this.friendRequests} header>
              <Badge style={{ backgroundColor: '#FC642D' }}>
                <Text>{this.state.pending.length}</Text>
              </Badge>
              <Text style={styles.header}> Friend Requests</Text>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow} />
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="md-people" style={styles.headerIcon} />
              <Text style={styles.header}>Friends</Text>
            </CardItem>
            {!this.state.friends.length ? <Spinner /> :
            <View>
            {Object.keys(this.state.friends[0]).map((friend) => {
              return (
                <SwipeRow
                  rightOpenValue={-75}
                  key={friend}
                  body={
                    <CardItem>
                      <Left>
                        <FAIcon name="apple" size={25} color="#FF4B63" />
                      </Left>
                      <Body>
                        <Text style={styles.bodytxt}>
                          {friend}
                        </Text>
                      </Body>
                      <Right />
                    </CardItem>
                  }
                  right={
                    <Button
                      danger
                      onPress={() => this.deleteFriend(friend)}
                    >
                      <Icon active name="md-close-circle" />
                    </Button>
                  }
                />
              );
            })}

            </View>
          }
          </Card>
        </Content>
      </Container>
    );
  }
}
