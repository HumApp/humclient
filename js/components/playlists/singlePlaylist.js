import React, { Component } from 'react';
import {
  Container,
  Content,
  Button,
  Left,
  Body,
  Grid,
  Row,
  Col,
  Icon,
  Text,
  Right,
  List,
  ListItem,
  Card,
  CardItem,
  Thumbnail
} from 'native-base';
import styles from './styles';
import Database from '../../../utils/database';
import { NativeModules } from 'react-native';
export default class SinglePlaylist extends Component {
  goToShare = playlistId => {
    this.props.navigation.navigate('SharePlaylist', playlistId);
  };
  render() {
    return (
      <Container>
        <Content>

          <Card>
            <CardItem button header onPress= {() => this.goToShare("-KrklLkFi0xUD2owjZxi")} bordered>
              <Body>
                <Text style={styles.pheader}>Summer</Text>
                <Text note style={styles.subtitle}>Playlist by Olivia Oddo</Text>
              </Body>
              <Right>
                <Icon name="ios-share-outline" style={styles.headerIcon} />
              </Right>
            </CardItem>
            <CardItem header>
              <Body>
                <Text style={styles.songHeader}>Songs</Text>
              </Body>
            </CardItem>
            <ListItem avatar bordered>
              <Left>
                <Thumbnail square size={80} source={{ uri: "https://images-na.ssl-images-amazon.com/images/I/71JWCAY6cvL._AC_UL115_.jpg" }} />
              </Left>
              <Body>
                <Text style={styles.bodytxt}>Simon Mignolet</Text>
                <Text note style={styles.bodytxt}>Ice Cube</Text>
              </Body>

            </ListItem>
            <ListItem bordered avatar>
              <Left>
                <Thumbnail square size={80} source={{ uri: "https://images-na.ssl-images-amazon.com/images/I/71JWCAY6cvL._AC_UL115_.jpg" }} />
              </Left>
              <Body>
                <Text style={styles.bodytxt}>Simon Mignolet</Text>
                <Text note style={styles.bodytxt}>Ice Cube</Text>
              </Body>

            </ListItem>
            <ListItem bordered avatar>
              <Left>
                <Thumbnail square size={80} source={{ uri: 'https://upload.wikimedia.org/wikipedia/en/7/74/InBetweenDreams.jpg' }} />
              </Left>
              <Body>
                <Text style={styles.bodytxt}>Simon Mignolet</Text>
                <Text note style={styles.bodytxt}>Ice Cube</Text>
              </Body>

            </ListItem>
            <CardItem>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
