import * as firebase from 'firebase';

export function getAllFriends() {
  let user = firebase.auth().currentUser;
  return firebase.database().ref(`/users/${user.uid}/friends`);
}

export function getPendingFriends() {
  let user = firebase.auth().currentUser;
  return firebase.database().ref(`/users/${user.uid}/pending`);
}

export function requestFriend(recievingUser, sendBack) {
  let user = firebase.auth().currentUser;
  firebase
    .database()
    .ref(`/users/${recievingUser}/pending/${user.uid}`)
    .set(true);
  if (!sendBack) {firebase
      .database()
      .ref(`/users/${user.uid}/sent/${recievingUser}`)
      .set(true);}
}


export function addFriendFromPending(friend) {
  let user = firebase.auth().currentUser;
  firebase.database().ref(`/users/${user.uid}/pending/${friend}`).remove();
  firebase
    .database()
    .ref(`/users/${friend}/username`)
    .once('value', function(snap) {
      firebase
        .database()
        .ref(`/users/${user.uid}/friends/${friend}`)
        .set(snap.val());
    });
  requestFriend(friend, true);
}

export function rejectFriendFromPending(friend) {
  let user = firebase.auth().currentUser;
  firebase.database().ref(`/users/${user.uid}/pending/${friend}`).remove();
}

export function deleteFriend(friend) {
  let user = firebase.auth().currentUser;
  firebase.database().ref(`/users/${user.uid}/friends/${friend}`).remove();
  firebase.database().ref(`/users/${friend}/friends/${user.uid}`).remove();
}
