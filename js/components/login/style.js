import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#06db77',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  login: {
    backgroundColor: '#06db77',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    color: '#484848',
    fontSize: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  form: {
    padding: 15
  },

  loginTxt: {
    padding: 15,
    marginTop: 50,
    color: '#484848',
    fontSize: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
});
