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
    .ref(`/users/${user.uid}/sharedPlaylists`);
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
      `songs/${getUrlPath(fetchSong.title)}/${getUrlPath(
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
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}`)
    .once('value')
    .then(snapshot => {
      let id = snapshot.val().spotifyId;
      let userToken = snapshot.val().accessToken;
      let firedata = firebase.database().ref(`playlists/${databasePlaylistId}`);
      let external = [];
      firedata.once('value')
        .then(snapshot => {
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
              .catch(error => "Not found")
          );
          Promise.all(promises).then(values => {
            let final = values.filter(value => value !== "Not found").map(value => value.data);
            axios
              .post(
              `https://api.spotify.com/v1/users/${id}/playlists`,
              `{\"name\":\"${playlist.title}\", \"public\":false, \"description\":\"A Hum playlist created by ${playlist.displayName}\"}`,
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
                  .then(response => console.log('Import successful!'))
                  .catch(error =>
                    console.log('Error while importing playlist: ', error)
                  );
              })
              .catch(error =>
                console.log('Error while creating new playlist: ', error)
              );
          });
        });
    });
};

function getUrlPath(str) {
  return encodeURIComponent(str).replace('.', function (char) {
    return '%' + char.charCodeAt(0).toString(16);
  });
}

function getNameFromUrlPath(url) {
  return decodeURIComponent(url);
}
