import * as firebase from 'firebase';

export default class Database {
  static savePlaylist(playlist, providerId) {
    let playlistSongs = {};
    playlist.forEach(fetchSong => {
      this.findOrCreateSong(fetchSong, providerId);
      const newSong = firebase.database().ref('playlists').push().key;
      (playlistSongs.artist = fetchSong.artist), (playlistSongs.title =
        fetchSong.title);
    });
    const newPlaylistId = firebase.database().ref('playlists').push().key;
    firebase.database().ref(`playlists/${newPlaylistId}`).set({
      title: 'olivia playlist',
      creator: 'wonjun',
      songs: playlistSongs
    });
  }

  static async findOrCreateSong(fetchSong, providerId) {
    try {
      const address = firebase
        .database()
        .ref(`songs/${fetchSong.title}/${fetchSong.artist}`);
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
