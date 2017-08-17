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
  Switch
} from 'native-base';
import styles from './styles';
import Database from '../../../utils/database';


export default class SharePlaylist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistId: "",
      friends: [{username: "oliviaoddo", switchValue: false}, {username: "brian", switchValue: false}]
    }
  }

  submitShare = () => {
    console.log(this.state.friends.filter(friend => friend.switchValue).map(friend => friend.username))
    console.log(this.props.navigation.state.params)
    this.props.navigation.goBack()
    //add toast shared successfully
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
          </Item>
          <Button onPress={() => {console.log("clear")}}transparent>
            <Icon name="ios-close-circle" />
          </Button>
        </Header>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="md-people" style={styles.headerIcon} />
              <Text style={styles.header}>Friends</Text>
            </CardItem>
            {this.state.friends.map(friend => {
              return (
                        <CardItem key={friend.username}>
                          <Body>
                          <Text style={styles.bodytxt}>{friend.username}</Text>
                          </Body>
                            <Right>
                              <Switch onValueChange={(value) => this.setState({friends: this.state.friends.map(user => {
                                    if (friend.username === user.username) user.switchValue = !user.switchValue
                                    return user
                              })})}
                                value={friend.switchValue} />
                            </Right>
                        </CardItem>
                      )
            })}
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


// () => Database.saveAppleMusicPlaylist("-KrklLkFi0xUD2owjZxi", "alt-j", "Olivia")
