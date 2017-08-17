const functions = require('firebase-functions');
const axios = require('axios');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.getSongId = functions.https.onRequest((req, response) => {
  let reqSong = req.body;
  const urlTitle = getURL(req.body.title);
  const urlArtist = getURL(req.body.artist);
  let foundId;
  admin.database().ref(`/songs/${urlTitle}/${urlArtist}`).once('value')
    .then(snapshot => {
      let id = snapshot.child(reqSong.service).val();
      if (id) {
        console.log('found id', id);
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
              Authorization: 'Bearer BQAw6VUAjB7MaLBZv_DIC2X_Z0sMVb5Ya8jGBqVV9lNuzMBjuBt3SsghvSuD6B8jxTr_nb3mTHNwH80JMD2_X3mXowFiI_4IBlqc11SAsRXi1eEyWrSAHoZ4wWd9X-x2Iw8N_LV6sIXrNrIGsZSbrSYn2UjAuGjR78d-YHL-vUeiVTrKOR508c0CPP8TBio8qL8F6boxkwgYdTc5jBVCSuq8sY1pTUdFoVLaYWV5Fqkdh2hyuwTlbqkRbWAzYou0_Zw-lXHMRr0aMV-L4z3sd6RDk1nT1-_TJINlNmPk_2-7PuYRtgeL50uB6CRiWT7boupR'
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

exports.savePlayistToSpotify = functions.https.onRequest((req, res) => {
  //given a DB playlist ID and spotify user token, saves the playlist from the database to spotify
  const userToken = req.body.userToken;
  const playlistId = req.body.playlistId;
  admin.database().ref(`/playlists/${playlistId}/songs`).once('value')
    .then(snap => {
      let songIds = [];
      let spotifyIds = [];
      snap.forEach(child => {
        songIds.push(child.key);
      });
      //songIds now contains all of the ids of the songs
      let promArr = [];
      songIds.forEach(songId => {
        promArr.push(admin.database().ref(`/songs/${songId}`).once('value'));
      });
      Promise.all(promArr)
        .then(arr => {
          arr.forEach(song => {
              axios.post('https://us-central1-hum-app.cloudfunctions.net/getSongId', {
                  title: song.title,
                  artist: song.artist,
                  service: 'spotifyId'
                })
                .then(id => spotifyIds.push(id));
            })
            .then(() => {
              axios.post(`POST https://api.spotify.com/v1/users/${userToken}/playlists/{playlist_id}/${spotifyIds.join(',')}`);
            });
        });
      //after that, post to axios with the songs to add the the playlist
    });
});

exports.friendTest = functions.https.onRequest((req, res) => {
  admin.database().ref(`/users/${req.body.recieve}/pending/${req.body.sending}`).set(true);
  res.send(201);

});

function makeiTunesSongQuery(songTitle, songArtist) {
  return `https://itunes.apple.com/search?term=${songTitle} ${songArtist}&media=music`;
}

function makeSpotifySongQuery(songTitle, songArtist) {
  return `https://api.spotify.com/v1/search?q=track:${songTitle.replace(' ', '+')}+artist:${songArtist.replace(' ', '+')}&type=track&market=us`;
}

function getURL(str) {
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
