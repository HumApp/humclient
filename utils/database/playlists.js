import * as firebase from 'firebase';
import axios from 'axios';

export function savePlaylistToDatabase(playlists, providerId) {
  const currentUser = firebase.auth().currentUser;
  playlists.forEach(playlist => {
    let newSong = {};
    playlist.songs.forEach((song, index) => {
      findOrCreateSong(song, providerId);
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
      displayName: currentUser.displayName,
      type: providerId
    });
  });
}

export function addPlaylistToUser(playlistId) {
  let user = firebase.auth().currentUser;
  firebase
    .database()
    .ref(`/users/${user.uid}/playlists/${playlistId}`)
    .set('original');
}

//get playlist from id
export function getPlaylistFromId(pid) {
  return firebase.database().ref(`/playlists/${pid}`).once('value');
}

//get pending playlists
export function getSharedPlaylists() {
  let user = firebase.auth().currentUser;
  return firebase
    .database()
    .ref(`/users/${user.uid}/sharedPlaylists`)
    .once('value');
}

//the pending folder
export function sharePlaylistWithFriend(playlistId, friendId) {
  firebase
    .database()
    .ref(`/playlists/${playlistId}/sharedWith/${friendId}`)
    .set(true);
  firebase
    .database()
    .ref(`/users/${friendId}/sharedPlaylists/${playlistId}`)
    .set(true);
}

//add playlist from pending folder to playlists folder and remove it from the pending folder
export function addPlaylistFromPending(playlistId) {
  let user = firebase.auth().currentUser;
  firebase
    .database()
    .ref(`/users/${user.uid}/sharedPlaylists/${playlistId}`)
    .remove();
  firebase
    .database()
    .ref(`/users/${user.uid}/playlists/${playlistId}`)
    .set('shared');
}

export function unfollowPlaylist(playlistId) {
  let user = firebase.auth().currentUser;
  firebase
    .database()
    .ref(`/users/${user.uid}/sharedPlaylists/${playlistId}`)
    .remove();
  firebase
    .database()
    .ref(`/playlists/${playlistId}/sharedWith/${user.uid}`)
    .remove();
}


export async function findOrCreateSong(fetchSong, providerId) {
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

export function deleteAllUserPlaylists(userId, type) {
  firebase
    .database()
    .ref(`playlists`)
    .orderByChild('creator')
    .equalTo(userId)
    .once('value')
    .then(playlists => {
      playlists.forEach(playlist => {
        let key = playlist.key;
        if (playlist.val().type == type) {
          firebase.database().ref(`playlists/${key}`).remove();
          firebase.database().ref(`users/${userId}/playlists/${key}`).remove();
        }
      });
    });
}

export function databasePlaylistToSpotify(databasePlaylistId) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      let id = user.id;
      let userToken = user.accessToken;
      let firedata = firebase
        .database()
        .ref(`playlists/${databasePlaylistId}`);
      let external = [];
      firedata.on('value', function(snapshot) {
        const playlist = snapshot.val();
        console.log('Importing: ', playlist);
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
          console.log('URIs: ', final);
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
                .then(response => console.log('Import successful'))
                .catch(error =>
                  console.log('Error while importing playlist: ', error)
                );
            })
            .catch(error =>
              console.log('Error while creating new playlist: ', error)
            );
        });
      });
    } else {
      console.log('No user is signed in');
    }
  });
}

function getUrlPath(str) {
  return encodeURIComponent(str).replace('.', function(char) {
    return '%' + char.charCodeAt(0).toString(16);
  });
}

function getNameFromUrlPath(url) {
  return decodeURIComponent(url);
}
