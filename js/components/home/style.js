import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: 60
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    color: '#fff',
    fontFamily: "PingFangTC-Light",
    backgroundColor: 'transparent'
  },
  subtitle: {
    textAlign: 'center',
    color: '#fff',
    opacity: .9,
    marginBottom: 5,
    fontSize: 20,
    fontFamily: "PingFangSC-Light",
    backgroundColor: 'transparent'
  },
  signup: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 75,

  }
});
