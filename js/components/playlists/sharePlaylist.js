import React, { Component } from 'react';
import * as firebase from 'firebase';
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
  Thumbnail,
  Header,
  Item,
  Input,
  Switch,
  Spinner,
  Toast
} from 'native-base';
import styles from './styles';
import * as Database from '../../../utils/database';


export default class SharePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistId: "",
      friends: []
    }
  }

  friendsCallback = async snap => {
    console.log('beginning of friends callback');
    let friendsArr = [];
    for (let friendId in snap.val()) {
      console.log('friend id', snap.val());
      friendsArr.push({
        friendId: friendId,
        friendName: snap.val()[friendId],
        switchValue: false
      });
    }
    this.setState({ friends: [] }, () => {
      this.setState({ friends: this.state.friends.concat(friendsArr) }, () =>
        this.setState({ isLoading: false })
      );
    });
  };


  componentDidMount() {
    Database.getAllFriends().on('value', this.friendsCallback);
  }

  submitShare = () => {
    console.log(this.state.friends.filter(friend => friend.switchValue).map(friend => friend.username))
    this.state.friends.forEach(friend => Database.sharePlaylistWithFriend(this.props.navigation.state.params, friend.friendId));
    Toast.show({ text: 'Playlist shared!', position: 'bottom', duration: 1500, type: 'success' })
    this.props.navigation.goBack()
  }

  render() {
    console.log(this.state.friends)
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
          </Item>
          <Button onPress={() => { console.log("clear") }} transparent>
            <Icon name="ios-close-circle" />
          </Button>
        </Header>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="md-people" style={styles.headerIcon} />
              <Text style={styles.header}>Friends</Text>
            </CardItem>
            {!this.state.friends.length ? <Text>NO FRANS FOR YOU</Text> :
              <View>
                {this.state.friends.map(friend => {
                  return (
                    <ListItem key={friend.friendId}>
                      <Body>
                        <Text style={styles.bodytxt}>{friend.friendName}</Text>
                      </Body>
                      <Right>
                        <Switch onValueChange={(value) => this.setState({
                          friends: this.state.friends.map(user => {
                            if (friend.friendId === user.friendId) user.switchValue = !user.switchValue
                            return user
                          })
                        })}
                          value={friend.switchValue} />
                      </Right>
                    </ListItem>
                  )
                })}
              </View>
            }
            <CardItem>
              <Button
                rounded
                iconRight
                onPress={this.submitShare}
                style={styles.share}
              >
                <Text style={{ fontSize: 18 }}>Share</Text>
                <Icon name="ios-arrow-forward" style={{ color: '#fff' }} />
              </Button>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
