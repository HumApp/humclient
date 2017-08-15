const functions = require('firebase-functions');
const axios = require('axios');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.getSongId = functions.https.onRequest((req, response) => {
  let reqSong = req.body;
  admin.database().ref(`/songs/${reqSong.title}/${reqSong.artist}`).once('value')
  .then(snapshot => {
      let id = snapshot.child(reqSong.service).val();
      if (id) {response.send(id.toString());}
      else if (reqSong.service === 'appleId') {
        axios.get(makeiTunesSongQuery(reqSong.title, reqSong.artist))
          .then(res => res.data)
          .then(json => {
            let track = json.results[0];
            //save id to the database
            response.send(track.trackId.toString());
          })
          .catch(console.error);
        } else {
          axios.get(makeSpotifySongQuery(reqSong.title, reqSong.artist), {
            headers: {
              // Accept: 'application/json',
              Authorization: 'Bearer BQDr7U_bQgpM2l3R17synWX2SbtCvX2L3POtseIPGZv9lByJU9S404zs4Uf3KHyaNiYYL-uRu0WT5LOwlGtOam6EW4R3GE3m7aZHMXQPEJ770oQYfDVKIbeMPCKXV3FFE0XFA66SFaGmYq04-EdHyu6mDcr1dOgAo6t6Z4N6sCpiRQM46vsL5sn3r76mJyJlcPi4TxicKKF3lVUl0oFVUPJ6T9PMWkGkr2KOt0yvFZlA8Cpo7dtlX1qMlDPH5cT8VN9I8AM45u9qmcRGI2I0bW6e4roH5mV4o25tB53GRGMGD23NBMuot2fFfksyZjH8ZzUX',
              // 'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .catch(console.error)
          .then(res => res.data)
          .then(json => {
            console.log('json.name', json.tracks.items[0].name);
          });
        }
    })
    .catch(console.error);
});

function makeiTunesSongQuery(songTitle, songArtist) {
  return `https://itunes.apple.com/search?term=${songTitle} ${songArtist}&media=music`;
}
function makeSpotifySongQuery(songTitle, songArtist) {
  return `https://api.spotify.com/v1/search?q=track:${songTitle} artist:${songArtist}&type=track&market=us`;
}
