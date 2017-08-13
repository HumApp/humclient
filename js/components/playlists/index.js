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
  View
} from 'native-base';
import styles from './styles'
export default class Playlists extends Component {
  goToPlaylist = playlist => {
    this.props.navigation.navigate('SinglePlaylist', playlist);
  };

  render() {
    return (
      <Container>
        <Content>
          <Card>
            <CardItem header>
              <Icon active name="ios-musical-notes" style={styles.headerIcon}/>
              <Text style={styles.header}>Playlists</Text>
            </CardItem>
            <CardItem button onPress={() => this.goToPlaylist()}>
              <Body>
                <Text style={styles.bodytxt}>Summer</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"  style={styles.arrow}/>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={styles.bodytxt}>Vibes</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"  style={styles.arrow} />
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Text style={styles.bodytxt}>Chill</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward"  style={styles.arrow}/>
              </Right>
            </CardItem>
          </Card>
          <Card>
            <CardItem header>
              <Icon active name="musical-note" style={styles.headerIcon}/>
              <Text style={styles.header}>Shared with Me</Text>
            </CardItem>
            <SwipeRow
              rightOpenValue={-75}
              body={
                <CardItem>
                  <Body>
                    <Text style={styles.bodytxt}>Party</Text>
                  </Body>
                  <Right>
                    <Icon name="ios-checkmark-circle" />
                  </Right>
                </CardItem>
              }
              right={
                <Button danger onPress={() => alert('Trash')}>
                  <Icon active name="trash" />
                </Button>
              }
            />
            <CardItem>
              <Body>
                <Text style={styles.bodytxt}>Beets</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" style={styles.arrow}/>
              </Right>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
