import * as firebase from 'firebase';

export default class Database {
  static async savePlaylist(playlist, providerId) {
    try {
      let newPlaylist = {};
      playlist.songs.forEach(fetchSong => {
        await findOrCreateSong(fetchSong, providerId);
        (newPlaylist.artist = fetchSong.artist), (newPlaylist.title =
          fetchSong.title);
      });
      const newPlaylistId = firebase.database().ref('playlists').push().key;
      firebase.database().ref(`playlists/${newPlaylistId}`).set({
        title: playlist.title,
        creator: firebase.auth().currentUser.uid,
        songs: newPlaylist
      });
    } catch (err) {
      alert(err);
    }
  }

  static async findOrCreateSong(fetchSong, providerId) {
    try {
      const address = firebase
        .database()
        .ref(`songs/${fetchSong.title}/${fetchSong.artist}`);
      const dataSnapshot = await address.once(value);
      if (!dataSnapshot.val()) {
        await address.set({
          [providerId]: fetchSong.id,
          image: fetchSong.image
        });
      } else {
        if (!dataSnapshot.hasChild(providerId)) {
          await address.set({
            [providerId]: fetchSong.id
          });
        }
      }
    } catch (err) {
      alert(err);
    }
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
