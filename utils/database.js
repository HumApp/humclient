import * as firebase from 'firebase';
import axios from 'axios';
import { NativeModules } from 'react-native';

export default class Database {
  //this might work?
  static getAllUsers() {
    firebase.database().ref('/users').on('value', function (snapshot){
      return snapshot.val();
    })
  }

  static requestFriend (recievingUser) {
    let user = firebase.auth().currentUser;
    firebase.database().ref(`/users/${recievingUser}/pending/${user}`).set(true);
  }

  static getPendingFriends () {
    let user = firebase.auth().currentUser;
    firebase.database().ref();
  }

  static savePlaylistToDatabase(playlists, providerId) {
    let loggedInUser = this.getCurrentUser()
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
        creator: "oliviaoddo",
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

          console.log(playlists)
          playlists.forEach(playlist => {
            let newSong = {}
            playlist.songs.forEach((song, index) => {
              this.findOrCreateSong(song, providerId);
              newSong[index] = {};
              newSong[index].artist = song.artist;
              newSong[index].title = song.title;
            })
            const newPlaylistId = firebase.database().ref('playlists').push().key;
            firebase.database().ref(`playlists/${newPlaylistId}`).set({
              title: playlist.name,
              creator: "Olivia",
              songs: newSong
            });
          });
        })
      })
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
  static saveAppleMusicPlaylist = (spotifyPlaylistId, playlistName, author) => {
    let firedata = firebase.database().ref(`playlists/${spotifyPlaylistId}`);
    let external = [];
    firedata.on('value', function (snapshot) {
      const playlist = snapshot.val();
      playlist.songs.forEach(song => external.push(song));
      let promises = external.map(song => axios.post(
        "https://us-central1-hum-app.cloudfunctions.net/getSongId/",
        { "title": `${song.title}`, "artist": `${song.artist}`, "service": "appleId"},
        {
          headers: {
            "Content-Type": "application/json",
          }
        }));
      Promise.all(promises).then(values => {
        let final = values.map(value => value.data.toString());
        let obj = {
          name: playlistName,
          author: author,
          songs: final
        }
        let applePlaylist = JSON.stringify(obj);
        NativeModules.MediaLibraryManager.createPlaylist(applePlaylist, (str) => {console.log(str);})
    })
  })
  }
}

