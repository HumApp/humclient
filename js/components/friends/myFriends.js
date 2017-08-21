import React, { Component } from 'react';
import {
  Container,
  Content,
  Icon,
  Button,
  Text,
  Card,
  Body,
  View,
  Header,
  Left,
  Input,
  Item,
  Spinner,
  CardItem,
  Badge,
  Right,
  SwipeRow
} from 'native-base';
import { default as FAIcon } from 'react-native-vector-icons/FontAwesome';
import styles from './styles';

export default class MyFriends extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Content>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Search through your friends"
              onChangeText={text => this.props.searchMyFriends(text)}
            />
          </Item>
        </Header>
        <Card>
          {this.props.pending.length
            ? <CardItem button onPress={() => this.props.goToPending()} header>
                <Badge style={{ backgroundColor: '#FC642D' }}>
                  <Text>
                    {this.props.pending.length}
                  </Text>
                </Badge>
                <Text style={styles.header}> Friend Requests</Text>
                <Right>
                  <Icon name="arrow-forward" style={styles.arrow} />
                </Right>
              </CardItem>
            : null}
        </Card>
        <Card>
          <CardItem header>
            <Icon active name="md-people" style={styles.headerIcon} />
            <Text style={styles.header}>Friends</Text>
          </CardItem>
          {this.props.isLoading
            ? <Spinner color="#FC642D" />
            : <View>
                {!this.props.friends.length
                  ? <CardItem>
                      <Text>Search for friends to add them!</Text>
                    </CardItem>
                  : <View>
                      {this.props.friends.map(friend => {
                        return (
                          <SwipeRow
                            rightOpenValue={-75}
                            key={friend.friendId}
                            body={
                              <CardItem>
                                <Left>
                                  <FAIcon
                                    name="apple"
                                    size={25}
                                    color="#FF4B63"
                                  />
                                </Left>
                                <Body>
                                  <Text style={styles.bodytxt}>
                                    {friend.friendName}
                                  </Text>
                                </Body>
                                <Right />
                              </CardItem>
                            }
                            right={
                              <Button
                                danger
                                onPress={() =>
                                  this.props.deleteFriend(friend.friendId)}
                              >
                                <Icon active name="md-close-circle" />
                              </Button>
                            }
                          />
                        );
                      })}
                    </View>}
              </View>}
        </Card>
      </Content>
    );
  }
}
