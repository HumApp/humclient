import * as firebase from 'firebase';

export default class Database {
  static setUserInfo(userId, info) {
    let userNamePath = '/user/' + userId + '/details';

    return firebase.database().ref(userNamePath).set({
      name: name
    });
  }

  static listenUserInfo(userId, callback) {
    let userNamePath = '/user/' + userId + '/details';

    firebase.database().ref(userNamePath).on('value', snapshot => {
      var name = '';

      if (snapshot.val()) {
        name = snapshot.val().name;
      }
      callback(name);
    });
  }
}
