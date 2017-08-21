import * as firebase from 'firebase';

export function getAllUsers() {
  return firebase.database().ref('/users').once('value');
}

export function getUserFromId(uid) {
  return firebase.database().ref(`/users/${uid}`).once('value');
}

export function getUsersByName(name) {
  return firebase.database().ref(`/users/`).orderByChild('username').equalTo;
}
