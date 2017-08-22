import * as firebase from 'firebase';

export function getAllUsers() {
  return firebase.database().ref('/users').once('value');
}

export function getUserFromId(uid) {
  return firebase.database().ref(`/users/${uid}`).once('value');
}

export async function getUsersByAnyName(name) {
  try {
    if (!name || name === '') return null;
    const nextName =
      name.slice(0, name.length - 1) +
      String.fromCharCode(name.charCodeAt(name.length - 1) + 1);
    let searchedUsers = {};
    await firebase
      .database()
      .ref('users')
      .orderByChild('username')
      .startAt(name)
      .endAt(nextName)
      .once('value', function(snapshot) {
        snapshot.val() &&
          Object.keys(snapshot.val()).map(key => {
            searchedUsers[key] = {
              username: snapshot.child(`${key}/username`).val(),
              fullname: snapshot.child(`${key}/fullname`).val()
            };
          });
      });
    await firebase
      .database()
      .ref('users')
      .orderByChild('fullname')
      .startAt(name)
      .endAt(nextName)
      .once('value', function(snapshot) {
        snapshot.val() &&
          Object.keys(snapshot.val()).map(key => {
            if (!searchedUsers[key])
              searchedUsers[key] = {
                username: snapshot.child(`${key}/username`).val(),
                fullname: snapshot.child(`${key}/fullname`).val()
              };
          });
      });
    if (Object.keys(searchedUsers).length === 0) return null;
    return searchedUsers;
  } catch (err) {
    throw err;
  }
}
