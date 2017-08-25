import * as firebase from 'firebase';
import axios from 'axios';
import { NativeModules } from 'react-native';

export async function savePlaylistToDatabase(playlists, providerId) {
  try {
    // if (providerId === 'appleId') {
    const appleToken = await axios.get(
      'https://us-central1-hum-app.cloudfunctions.net/getJWT',
      {
        headers: {
          pass: "lol this isn't secure"
        }
      }
    );
    // }
    const currentUser = firebase.auth().currentUser;
    for (const playlist of playlists) {
      let newSong = {};
      for (const index in playlist.songs) {
        if (providerId === 'appleId') {
          playlist.songs[index].image =
            'https://static.tumblr.com/qmraazf/ps5mjrmim/unknown-album.png';
          await axios
            .get(
              'https://api.music.apple.com/v1/catalog/us/songs/' +
                playlist.songs[index].id,
              {
                headers: {
                  Authorization: `Bearer ${appleToken.data}`
                }
              }
            )
            .then(response => {
              playlist.songs[
                index
              ].image = response.data.data[0].attributes.artwork.url
                .replace('{w}', '100')
                .replace('{h}', '100');
              findOrCreateSong(playlist.songs[index], providerId);
              let appleSongId = playlist.songs[index].id;
              newSong[appleSongId] = {};
              newSong[appleSongId].artist = playlist.songs[index].artist;
              newSong[appleSongId].title = playlist.songs[index].title;
              newSong[appleSongId].image = playlist.songs[index].image;
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          findOrCreateSong(playlist.songs[index], providerId);
          newSong[index] = {};
          newSong[index].artist = playlist.songs[index].artist;
          newSong[index].title = playlist.songs[index].title;
          newSong[index].image = playlist.songs[index].image;
        }
      }
      const newPlaylistId = firebase.database().ref('playlists').push().key;

      addPlaylistToUser(newPlaylistId);
      firebase.database().ref(`playlists/${newPlaylistId}`).set({
        title: playlist.name,
        creator: currentUser.uid,
        songs: newSong,
        displayName: currentUser.displayName,
        type: providerId,
        serviceId: playlist.id.toString() || '1425631'
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export function addPlaylistToUser(playlistId) {
  let user = firebase.auth().currentUser;
  firebase
    .database()
    .ref(`/users/${user.uid}/playlists/${playlistId}`)
    .set('original');
}
//get user's playlists
export function getUserPlaylists() {
  let user = firebase.auth().currentUser;
  return firebase.database().ref(`/users/${user.uid}/playlists/`);
}

//get playlist from id
export function getPlaylistFromId(pid) {
  return firebase.database().ref(`/playlists/${pid}`).once('value');
}

//get pending playlists
export function getSharedPlaylists() {
  let user = firebase.auth().currentUser;
  return firebase.database().ref(`/users/${user.uid}/sharedPlaylists`);
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
        `songs/${getUrlPath(fetchSong.title)}/${getUrlPath(fetchSong.artist)}`
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

export function databasePlaylistToSpotify(databasePlaylistId, success, fail) {
  firebase
    .database()
    .ref(`users/${firebase.auth().currentUser.uid}`)
    .once('value')
    .then(snapshot => {
      let id = snapshot.val().spotifyId;
      let userToken = snapshot.val().accessToken;
      let firedata = firebase.database().ref(`playlists/${databasePlaylistId}`);
      let external = [];
      firedata.once('value').then(snapshot => {
        const playlist = snapshot.val();
        playlist.songs.forEach(song => external.push(song));
        let promises = external.map(song =>
          axios
            .post(
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
            .catch(error => 'ERROR')
        );
        Promise.all(promises).then(values => {
          console.log(values);
          let final = values
            .map(value => value.data)
            .filter(value => value !== 'ERROR');
          console.log('FINALLLLLL', final);
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
                .then(response => success(databasePlaylistId))
                .catch(error => fail());
            })
            .catch(error => fail());
        });
      });
    });
}

export async function updateAppleMusic(oldPlaylists, done) {
  //only let if they are apple auth
  NativeModules.MediaLibraryManager.getPlaylists(async playlists => {
    // if a playlist id comes back that is not contained in the old playlist array, send it to save to database
    //oldPlaylists [{serviceId: appleId, id: databaseID, songs: []}, {serviceId: appleId, id: databaseID}]
    //refreshed playlists = [{playlistId: playlist.id, songs: playlist.songs}]
    const newPlaylists = [];
    const refreshedPlaylists = {};
    const alteredPlaylists = [];
    let old = {};
    const serviceToId = {};
    let parsedPlaylists = JSON.parse(playlists);

    for (playlist of parsedPlaylists) {
      let id = playlist.id;
      const songs = []
      for(song of playlist.songs){
        songs.push(song.id.toString())
      }
      refreshedPlaylists[id] = songs
    }
    for (playlist of oldPlaylists) {
      let id = playlist.serviceId;
      old[id] = playlist.songs
      serviceToId[playlist.serviceId] = playlist.id
      // oldPlaylistServiceIds.push(playlist.serviceId);
      let playlistKeyArr = Object.keys(refreshedPlaylists);
      if (playlistKeyArr.indexOf(playlist.serviceId) === -1) {
        firebase.database().ref(`playlists/${playlist.id}`).remove();
      } else {
        for (song of playlist.songs) {
          // if refreshed playlist songs doesn't contain this song, delete playlists/playlis.id/songs/song
            if (refreshedPlaylists[playlist.serviceId].indexOf(song) === -1) {
              firebase
                .database()
                .ref(`playlists/${playlist.id}/songs/${song}`)
                .remove();
              //should remove the songs from the local playlist object

            }
            //then add the playlist to the altered playlists
        }
      }
    }
    for (playlist of parsedPlaylists) {
      if (Object.keys(old).indexOf(playlist.id.toString()) === -1) newPlaylists.push(playlist);
      else{
        for(song of playlist.songs){
          if(old[playlist.id].indexOf(song.id) === -1) {
            // should add the new songs to the old local playlist object and
            // alteredPlaylists.push(playlist)
            let image = await getImage(song.id)
            firebase
                .database()
                .ref(`playlists/${serviceToId[playlist.id]}/songs/${song.id}`)
                .set({artist: song.artist, image: image, title: song.title});}
        }
        //add the playlist to the altered playlist array
      }
      // if old playlist array doesn't contain a song from the refreshed playlists add it
    }
    if(newPlaylists.length) savePlaylistToDatabase(newPlaylists, 'appleId');
    // need to send back modified playlists to update the state on the front end, the front end is only listening for adding/removing to a user's playlists

    done();
  });
}

async function getImage(id){
  const appleToken = await axios.get(
      'https://us-central1-hum-app.cloudfunctions.net/getJWT',
      {
        headers: {
          pass: "lol this isn't secure"
        }
      }
    );

    response =
          await axios
            .get(
              'https://api.music.apple.com/v1/catalog/us/songs/' +
                id,
              {
                headers: {
                  Authorization: `Bearer ${appleToken.data}`
                }
              }
            )
  const image = response.data.data[0].attributes.artwork.url .replace('{w}', '100')
                .replace('{h}', '100');
  console.log(image)
  return image
}

function getUrlPath(str) {
  return encodeURIComponent(str).replace(/\./g, function(char) {
    return '%' + char.charCodeAt(0).toString(16);
  });
}

function getNameFromUrlPath(url) {
  return decodeURIComponent(url);
}
