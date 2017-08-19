import * as firebase from 'firebase';

export default class Database {
  static savePlaylistToDatabase(playlists, providerId) {
    const currentUser = firebase.auth().currentUser
    playlists.forEach(playlist => {
      let newSong = {};
      playlist.songs.forEach((song, index) => {
        this.findOrCreateSong(song, providerId);
        newSong[index] = {};
        newSong[index].artist = song.artist;
        newSong[index].title = song.title;
        // newSong[index].image = song.image;
      });
      const newPlaylistId = firebase.database().ref('playlists').push().key;
      this.addPlaylistToUser(newPlaylistId);
      firebase.database().ref(`playlists/${newPlaylistId}`).set({
        title: playlist.name,
        creator: currentUser.uid,
        songs: newSong,
        displayName: currentUser.displayName
      });
    });
  }

  //this might work?
  static getAllUsers() {
    return firebase.database().ref('/users').once('value');
  }

  static getAllFriends() {
    let user = firebase.auth().currentUser;
    return firebase.database().ref(`/users/${user.uid}/friends`).once('value');
  }

  static getPendingFriends() {
    let user = firebase.auth().currentUser;
    return firebase.database().ref(`/users/${user.uid}/pending`).once('value');
  }

  static requestFriend(recievingUser, sendBack) {
    let user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`/users/${recievingUser}/pending/${user.uid}`)
      .set(true);
    if (!sendBack)
      firebase
        .database()
        .ref(`/users/${user.uid}/sent/${recievingUser}`)
        .set(true);
  }

  static getUserFromId(uid) {
    return Promise.resolve(firebase.database().ref(`/users/${uid}`).once('value'))
  }

  static addPlaylistToUser(playlistId) {
    let user = firebase.auth().currentUser;
    firebase.database().ref(`/users/${user.uid}/playlists/${playlistId}`).set(true);
  }

  static getSharedPlaylists() {
    let user = firebase.auth().currentUser;
    return firebase.database().ref(`/users/${user.uid}/sharedPlaylists`).once('value');
  }

  static sharePlaylistWithFriend(playlistId, friendId) {
    firebase.database().ref(`/playlists/${playlistId}/sharedWith/${friendId}`).set(true);
    firebase.database().ref(`/users/${friendId}/sharedPlaylists/${playlistId}`).set(true);
  }

  static unfollowPlaylist(playlistId) {
    let user = firebase.auth().currentUser;
    firebase.database().ref(`/users/${user.uid}/sharedPlaylists/${playlistId}`).remove();
    firebase.database().ref(`/playlists/${playlistId}/sharedWith/${user.uid}`).remove();
  }

  static addFriendFromPending(friend) {
    let user = firebase.auth().currentUser;
    firebase.database().ref(`/users/${user.uid}/pending/${friend}`).remove();
    firebase.database().ref(`/users/${friend}/username`).once('value', function (snap) {
      firebase.database().ref(`/users/${user.uid}/friends/${friend}`).set(snap.val());
    })
    this.requestFriend(friend, true);
  }

  static rejectFriendFromPending(friend) {
    let user = firebase.auth().currentUser;
    firebase.database().ref(`/users/${user.uid}/pending/${friend}`).remove();
  }
  static ignoreMe() {
    let user = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`/users/${user.uid}/pending`)
      .on('child_added')
      .then(snapshot => {
        let pending = snapshot.val();
        firebase
          .database()
          .ref(`/users/${user.uid}/sent`)
          .once('value', function (sentSnap) {
            let matches = _.intersection(sentSnap.val(), pending);
            if (matches) {
              matches.forEach(match => {
                firebase
                  .database()
                  .ref(`/users/${user.uid}/friends/${match}`)
                  .set(true);
                firebase
                  .database()
                  .ref(`/users/${user.uid}/pending/${match}`)
                  .remove();
                firebase
                  .database()
                  .ref(`/users/${user.uid}/sent/${match}`)
                  .remove();
              });
            }
          });
      });
  }
  static saveApplePlaylists(playlists, providerId) {
    playlists.forEach(playlist => {
      let newSong = {};
      playlist.songs.forEach((song, index) => {
        this.findOrCreateSong(song, providerId);
        newSong[index] = {};
        newSong[index].artist = song.artist;
        newSong[index].title = song.title;
      });
      const newPlaylistId = firebase.database().ref('playlists').push().key;
      firebase.database().ref(`playlists/${newPlaylistId}`).set({
        title: playlist.name,
        creator: 'Olivia',
        songs: newSong
      });
    });
  }

  static deleteAllUserPlaylists(userId) {
    firebase
      .database()
      .ref(`playlists`)
      .orderByChild('creator')
      .equalTo(userId)
      .once('value')
      .then(playlists => {
        playlists.forEach(playlist => {
          firebase.database().ref(`playlists/${playlist.key}`).remove();

          console.log(playlists);
          playlists.forEach(playlist => {
            let newSong = {};
            playlist.songs.forEach((song, index) => {
              this.findOrCreateSong(song, providerId);
              newSong[index] = {};
              newSong[index].artist = song.artist;
              newSong[index].title = song.title;
            });
            const newPlaylistId = firebase.database().ref('playlists').push()
              .key;
            firebase.database().ref(`playlists/${newPlaylistId}`).set({
              title: playlist.name,
              creator: 'Olivia',
              songs: newSong
            });
          });
        });
      });
  }

  static getPlaylist(playlist, userId) {
    return firebase.database().ref(`playlists/`).on();
  }

  static getCurrentUser() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in
        return user.uid;
      } else {
        // No user is signed in
        return 'Unknown';
      }
    });
  }

  static saveMultiPlaylists(playlists, providerId) {
    for (playlistName in playlists) {
      if (playlists.hasOwnProperty(playlistName)) {
        const playlist = playlists[playlistName];
        this.savePlaylist(playlist, playlistName, providerId);
      }
    }
  }

  static savePlaylist(playlist, playlistName, providerId) {
    let newSong = {};
    playlist.forEach((fetchSong, idx) => {
      this.findOrCreateSong(fetchSong, providerId);
      newSong[idx] = {};
      newSong[idx].artist = fetchSong.artist;
      newSong[idx].title = fetchSong.title;
    });
    const newPlaylistId = firebase.database().ref('playlists').push().key;
    firebase
      .database()
      .ref(`users/${this.getCurrentUser()}/playlists`)
      .once('value')
      .set({
        [newPlaylistId]: true
      });
    firebase.database().ref(`playlists/${newPlaylistId}`).set({
      title: playlistName,
      creator: this.getCurrentUser(),
      songs: newSong
    });
  }

  static async findOrCreateSong(fetchSong, providerId) {
    try {
      const address = firebase
        .database()
        .ref(
        `songs/${this.getUrlPath(fetchSong.title)}/${this.getUrlPath(
          fetchSong.artist
        )}`
        );
      const dataSnapshot = await address.once('value');
      if (!dataSnapshot.val()) {
        await address.set({
          [providerId]: fetchSong.id
        });
      } else {
        if (!dataSnapshot.hasChild(providerId)) {
          await address.set({
            [providerId]: fetchSong.id
          });
        }
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  static getUrlPath(str) {
    return encodeURIComponent(str).replace(/\./g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

  static getNameFromUrlPath(url) {
    return decodeURIComponent(url);
  }

  static databasePlaylistToSpotify(databasePlaylistId) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        let id = user.id;
        let userToken = user.accessToken;
        let firedata = firebase.database().ref(`playlists/${databasePlaylistId}`);
        let external = [];
        firedata.on('value', function (snapshot) {
          const playlist = snapshot.val();
          console.log("Importing: ", playlist);
          playlist.songs.forEach(song => external.push(song));
          let promises = external.map(song =>
            axios.post(
              'https://us-central1-hum-app.cloudfunctions.net/getSongId/',
              {
                title: `${song.title}`,
                artist: `${song.artist}`,
                service: 'spotifyId',
                userToken: `${userToken}`
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            )
          );
          Promise.all(promises).then(values => {
            let final = values.map(value => value.data);
            console.log("URIs: ", final);
            axios
              .post(
              `https://api.spotify.com/v1/users/${id}/playlists`,
              `{\"name\":\"A New Hum Playlist\", \"public\":false, \"description\":\"A Hum playlist created by Apple Music\"}`,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                  'Content-Type': 'application/json'
                }
              }
              )
              .then(response => {
                let playlistID = response.data.id;
                axios
                  .post(
                  `https://api.spotify.com/v1/users/${id}/playlists/${playlistID}/tracks`,
                  { uris: final },
                  {
                    headers: {
                      Authorization: `Bearer ${userToken}`,
                      'Content-Type': 'application/json'
                    }
                  }
                  )
                  .then(response => console.log("Import successful"))
                  .catch(error => console.log("Error while importing playlist: ", error));
              })
              .catch(error => console.log("Error while creating new playlist: ", error));
          });
        })
      } else {
        console.log('No user is signed in');
      }
    });
  }
}
