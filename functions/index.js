const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const _ = require('lodash');
//on request, searches the database for a given song by title and artist. If the
//function can't find it, then it queries apple or spotify, returns the result,
//and saves it the the DB for next time
exports.getSongId = functions.https.onRequest((req, response) => {
  let reqSong = req.body;
  const userToken = req.body.userToken;
  const urlTitle = getURL(req.body.title);
  const urlArtist = getURL(req.body.artist);
  let foundId;
  admin.database().ref(`/songs/${urlTitle}/${urlArtist}`).once('value')
    .then(snapshot => {
      let id = snapshot.child(reqSong.service).val();
      if (id) {
        response.send(id.toString());
      } else if (reqSong.service === 'appleId') {
        axios.get(makeiTunesSongQuery(reqSong.title, reqSong.artist))
          .then(res => res.data)
          .then(json => {
            let track = json.results[0];
            foundId = track.trackId.toString();
            sendResponseWithIdAndSave(response, foundId, urlTitle, urlArtist, reqSong.service);
          })
          .catch(console.error);
      } else {
        axios.get(makeSpotifySongQuery(reqSong.title, reqSong.artist), {
          headers: {
            Authorization: `Bearer ${userToken}`
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
// watches the pending folder of every user to faciliate the friend process
// matches pending and sent ID's to automatically respond to friend requests
exports.sentPendingWatch = functions.database.ref(`/users/{uid}/pending`).onWrite(function (event) {
  let uid = event.params.uid;
  let pending = Object.keys(event.data.val());
  admin.database().ref(`/users/${uid}/sent`).once('value', function (sentSnap) {
    let sent = Object.keys(sentSnap.val());
    let matches = _.intersection(sent, pending);
    if (matches.length > 0) {
      matches.forEach(match => {
        admin.database().ref(`/users/${uid}/friends/${match}`).set(true);
        admin.database().ref(`/users/${uid}/pending/${match}`).remove();
        admin.database().ref(`/users/${uid}/sent/${match}`).remove();
      });
    }
  });
});

exports.cascadePlaylistDelete = functions.database.ref(`/playlists/{PID}`).onDelete(function (event) {
  let PID = event.params.PID;
  let affectedUsers = event.data.previous.val().sharedWith;
  console.log('affectedUsers', affectedUsers);
  if (affectedUsers) {
    for (let uid in affectedUsers) {
    admin.database().ref(`/users/${uid}/playlists/${PID}`).remove();
  }
}
});


function makeiTunesSongQuery(songTitle, songArtist) {
  return `https://itunes.apple.com/search?term=${songTitle} ${songArtist}&media=music`;
}

function makeSpotifySongQuery(songTitle, songArtist) {
  return `https://api.spotify.com/v1/search?q=track:${songTitle.replace(' ', '+')}+artist:${songArtist.replace(' ', '+')}&type=track&market=us`;
}

function getURL(str) {
  return encodeURIComponent(str).replace('.', function (cha) {
    return '%' + cha.charCodeAt(0).toString(16);
  });
}

function sendResponseWithIdAndSave(response, id, urlTitle, urlArtist, service) {
  admin.database().ref(`/songs/${urlTitle}/${urlArtist}/${service}`).set(id);
  console.log(`set /songs/${urlTitle}/${urlArtist} to have child ${service} with value ${id}`);
  response.send(id);
}
