const functions = require('firebase-functions');
const axios = require('axios');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const _ = require('lodash');

// OB/TL: comment this file with exactly what you just told me
exports.getSongId = functions.https.onRequest((req, response) => {
  // OB/TL: consider splitting me up into smaller corporations
  let reqSong = req.body;
  const userToken = req.body.userToken;
  const urlTitle = getURL(req.body.title);
  const urlArtist = getURL(req.body.artist);
  let foundId; // <= OB/TL: this let is no longer necessary
  admin.database().ref(`/songs/${urlTitle}/${urlArtist}`).once('value')
    .then(snapshot => {
      let id = snapshot.child(reqSong.service).val();
      if (id) {
        console.log('found id', id);
        response.send(id.toString());
      } else if (reqSong.service === 'appleId') {
        // OB/TL: nested promise chains
        axios.get(makeiTunesSongQuery(reqSong.title, reqSong.artist))
          .then(res => res.data)
          .then(json => {
            let track = json.results[0];
            foundId = track.trackId.toString();
            sendResponseWithIdAndSave(response, foundId, urlTitle, urlArtist, reqSong.service);
          })
          .catch(console.error);
      } else {
        /* OB/TL: can also do `axios.get(url, {
          params: {
            term: 'some string'
          }
        }) */
        axios.get(makeSpotifySongQuery(reqSong.title, reqSong.artist), {
            headers: {
              Authorization: `Bearer ${userToken}`
              //  "Content-Type": 'application/x-www-form-urlencoded',
              //  Accept: 'application/json'
            }
          })
          .then(res => res.data)
          .then(json => {
            const uri = json.tracks.items[0].uri.toString();
            foundId = uri;
            sendResponseWithIdAndSave(response, foundId, urlTitle, urlArtist, reqSong.service);
          })
          .catch(console.error);
      }
    })
    .catch(console.error);
});

// OB/TL: dead code shouldn't be in master!
// exports.savePlayistToSpotify = functions.https.onRequest((req, res) => {
//   //given a DB playlist ID and spotify user token, saves the playlist from the database to spotify
//   const userToken = req.body.userToken;
//   const playlistId = req.body.playlistId;
//   admin.database().ref(`/playlists/${playlistId}/songs`).once('value')
//     .then(snap => {
//       let songIds = [];
//       let spotifyIds = [];
//       snap.forEach(child => {
//         songIds.push(child.key);
//       });
//       //songIds now contains all of the ids of the songs
//       let promArr = [];
//       songIds.forEach(songId => {
//         promArr.push(admin.database().ref(`/songs/${songId}`).once('value'));
//       });
//       Promise.all(promArr)
//         .then(arr => {
//           arr.forEach(song => {
//               axios.post('https://us-central1-hum-app.cloudfunctions.net/getSongId', {
//                   title: song.title,
//                   artist: song.artist,
//                   service: 'spotifyId'
//                 })
//                 .then(id => spotifyIds.push(id));
//             })
//             .then(() => {
//               axios.post(`POST https://api.spotify.com/v1/users/${userToken}/playlists/{playlist_id}/${spotifyIds.join(',')}`);
//             });
//         });
//     });
// });

// OB/TL: comment describing what this does / how / why
exports.sentPendingWatch = functions.database.ref(`/users/{uid}/pending`).onWrite(function (event) {
  let uid = event.params.uid;
  let pending = Object.keys(event.data.val());
  admin.database().ref(`/users/${uid}/sent`).once('value', function (sentSnap) {
    let sent = Object.keys(sentSnap.val());
    console.log('pending:', pending, 'Sent:', sent);
    let matches = _.intersection(sent, pending);
    if (matches.length > 0) {
      console.log('matches found:', matches);
      matches.forEach(match => {
        admin.database().ref(`/users/${uid}/friends/${match}`).set(true);
        admin.database().ref(`/users/${uid}/pending/${match}`).remove();
        admin.database().ref(`/users/${uid}/sent/${match}`).remove();
      });
    }
  });
});


/*
function (event) {
  let uid = event.params.uid;
  console.log('CHILD ADDED ===========');
  let pending = event.data.val();
  admin.database().ref(`/users/${uid}/sent`).once('value', function (sentSnap) {
    let matches = _.intersection(sentSnap.val(), pending);
    if (matches) {
      matches.forEach(match => {
        admin.database().ref(`/users/${uid}/friends/${match}`).set(true);
        admin.database().ref(`/users/${uid}/pending/${match}`).remove();
        admin.database().ref(`/users/${uid}/sent/${match}`).remove();
      });
    }
  });
*/
function makeiTunesSongQuery(songTitle, songArtist) {
  return `https://itunes.apple.com/search?term=${songTitle} ${songArtist}&media=music`;
}

function makeSpotifySongQuery(songTitle, songArtist) {
  return `https://api.spotify.com/v1/search?q=track:${songTitle.replace(' ', '+')}+artist:${songArtist.replace(' ', '+')}&type=track&market=us`;
}

function getURL(str) {
  // OB/TL: regexes are expensive to create, define this above if possible
  // OB/Tl: ...but instead here, just use a string '.'
  return encodeURIComponent(str).replace(/\./g, function (cha) {
    return '%' + cha.charCodeAt(0).toString(16);
  });
}

function sendResponseWithIdAndSave(response, id, urlTitle, urlArtist, service) {
  admin.database().ref(`/songs/${urlTitle}/${urlArtist}/${service}`).set(id);
  console.log(`set /songs/${urlTitle}/${urlArtist} to have child ${service} with value ${id}`);
  response.send(id);
  console.log('Sending and saving', id);
}
