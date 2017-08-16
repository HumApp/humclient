import * as firebase from 'firebase';

class Firebase {
  // Initialises Firebase
  static initialize() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAeIvTA7pcQQZ1i80667rYhX2a5oJhzaR4',
      authDomain: 'hum-app.firebaseapp.com',
      databaseURL: 'https://hum-app.firebaseio.com',
      projectId: 'hum-app',
      storageBucket: 'hum-app.appspot.com',
      messagingSenderId: '680274336951'
    });
  }
}

export default Firebase;
