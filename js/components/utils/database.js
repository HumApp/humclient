import * as firebase from 'firebase';

export default class Database {
  static saveMultiPlaylists(playlists, providerId) {
    for (playlistName in playlists) {
      if (playlists.hasOwnProperty(playlistName)) {
        const playlist = playlists[playlistName];
        let newSong = {};
        playlist.forEach((fetchSong, idx) => {
          this.findOrCreateSong(fetchSong, providerId);
          newSong[idx] = {};
          newSong[idx].artist = fetchSong.artist;
          newSong[idx].title = fetchSong.title;
        });
        const newPlaylistId = firebase.database().ref('playlists').push().key;
        firebase.database().ref(`playlists/${newPlaylistId}`).set({
          title: playlistName,
          creator: firebase.auth().currentUser.uid,
          songs: newSong
        });
      }
    }
  static async findOrCreateSong(fetchSong, providerId) {
    try {
      const address = firebase
        .database()
        .ref(
          `songs/${this.encodeURI(fetchSong.title)}/${this.encodeURI(
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

  static encodeURI(str) {
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
  
//    static saveMultiPlaylists(playlists, providerId) {
//     console.log(playlists[0])
//     console.log(typeof playlists)
//     playlists.forEach(playlist => {
//       let newSong = {}
//       playlist.songs.forEach((song, index) => {
//         this.findOrCreateSong(song, providerId);
//           newSong[index] = {};
//           newSong[index].artist = song.artist;
//           newSong[index].title = song.title;
//       })
//       const newPlaylistId = firebase.database().ref('playlists').push().key;
//         firebase.database().ref(`playlists/${newPlaylistId}`).set({
//         title: playlist.name,
//         creator: "Olivia",
//         songs: newSong
//       });
//     })
//   }

