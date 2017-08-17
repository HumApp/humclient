const React = require('react-native');

const { StyleSheet, Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

export default {
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FBFAFA'
  },
  shadow: {
    flex: 1,
    width: null,
    height: null
  },
  bg: {
    flex: 1,
    marginTop: deviceHeight / 1.75,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 30,
    bottom: 0
  },
  input: {
    marginBottom: 20
  },
  btn: {
    marginTop: 20,
    alignSelf: 'center'
  },
  header: {
    color: '#484848'
  },
  pheader: {
    color: '#484848',
    fontSize: 25
  },
  songHeader: {
    color: '#484848',
    fontSize: 20
  },
  subtitle: {
    color: '#484848'
  },
  bodytxt: {
    color: "#595959"
  },
  arrow: {
    color: "#FC642D"
  },
  headerIcon: {
    color: '#484848'
  },
  share: {
    backgroundColor: '#ff5a5f',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
};
