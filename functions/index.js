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
            let track = json.results[0]trackId.toString();
            admin.database().ref("/songs").set({
              reqSong.title : {
                  reqSong.artist: {
                    appleId: track
                  }
              }
            }).then(() => {
              response.send(track);
            })
          })
          .catch(console.error);
        } else {
          axios.get(makeSpotifySongQuery(reqSong.title.replace(' ', '+'), reqSong.artist.replace(' ', '+')),
          {
           headers: {
             "Authorization": "Bearer BQD57jmCLBcyccmoVzShwSV9gZLyBiljcr8OHO8zle03wLW74J76tEFiqLq3nwq_4ZuAVAihSAOJsXMUUZFjiu0-3S7-CI87bVuGts22eVaPB0LZ8S8lYaSnM6W-wgRQn2ueFTrXT3_B9NPhB30ZU52vWcgqAuAJWgo6xsxlx0nWi2QsqXbCkePbof8TkhmlqPxVNBwiKXnI_Utbr5_ewIC38V51_U9QGtknCL8NHBE-zwQ3bl6iVxRFEi244sRmBbHkJ8Movj2gzVXcpRLJpLSJRRC61XKN-TVxrxO80GhvZlqgdUO1YVrPCy6qIVHhDyXj",
           }
          })
          .then(res => res.data)
          .then(json => {
            console.log('json.name', json.tracks.items[0].name);
            response.send(json);
          })
          .catch(console.error);
        }
    })
    .catch(console.error);
});
function makeiTunesSongQuery(songTitle, songArtist) {
  return `https://itunes.apple.com/search?term=${songTitle} ${songArtist}&media=music`;
}
function makeSpotifySongQuery(songTitle, songArtist) {
  return `https://api.spotify.com/v1/search?q=track:${songTitle}+artist:${songArtist}&type=track&market=us`;
}
