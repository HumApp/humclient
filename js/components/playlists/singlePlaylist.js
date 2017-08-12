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
  Header,
  Item,
  Input,

} from 'native-base';
export default class SinglePlaylist extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Grid>
            <Row>
              <Body>
                <Text>Summer</Text>
              </Body>
              <Icon name="ios-share-outline" />
            </Row>
          </Grid>
          <Header searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search Songs" />
              <Icon name="musical-note" />
            </Item>
          </Header>
          <List>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem>
              <Body>
                <Text>Simon Mignolet</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
