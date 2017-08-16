import * as firebase from 'firebase';

export default class Database {
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
          `songs/${this.getUrl(fetchSong.title)}/${this.getUrl(
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

  static getUrl(str) {
    return encodeURIComponent(str).replace(/\./g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
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
