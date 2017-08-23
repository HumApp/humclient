const url = require('url');
const crypto = require('crypto');
const randomstring = require('randomstring');
const request = require('request');
const jwt = require('jsonwebtoken');
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
            if (!track) {
              console.warn('error', urlTitle, urlArtist);
              response.send('ERROR');
            } else {
              foundId = track.trackId.toString();
              sendResponseWithIdAndSave(response, foundId, urlTitle, urlArtist, reqSong.service);
            }
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
            if (!json.track.items[0].uri) {
              console.warn('error', urlTitle, urlArtist);
              response.send('ERROR');
            } else {
              const uri = json.tracks.items[0].uri.toString();
              foundId = uri;
              sendResponseWithIdAndSave(response, foundId, urlTitle, urlArtist, reqSong.service);
            }
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
}

// watches the pending folder of every user to faciliate the friend process
// matches pending and sent ID's to automatically respond to friend requests
exports.sentPendingWatch = functions.database.ref(`/users/{uid}/pending`).onWrite(function (event) {
  let uid = event.params.uid;
  let pending = Object.keys(event.data.val());
  pending.forEach(key => {
    if (event.data.val()[key] === false) admin.database().ref(`/users/${uid}/friends/${key}`).remove();
  });
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

// after a user deletes their playlist, makes sure that no reference to that playlist remains in
// any other user's playlist list
exports.cascadePlaylistDelete = functions.database.ref(`/playlists/{PID}`).onDelete(function (event) {
  let PID = event.params.PID;
  let affectedUsers = event.data.previous.val().sharedWith;
  let creator = event.data.previous.val().creator;
  admin.database().ref(`/users/${creator}/playlists/${PID}`).remove();
  if (affectedUsers) {
    for (let uid in affectedUsers) {
      admin.database().ref(`/users/${uid}/playlists/${PID}`).remove();
    }
  }
});

exports.getJWT = functions.https.onRequest((req, res) => {
  if (req.get('pass') === "lol this isn't secure") {
    const secret = `-----BEGIN PRIVATE KEY-----
${functions.config().apple.developertoken}
-----END PRIVATE KEY-----`;
    const keyId = functions.config().apple.keyid;
    const teamId = functions.config().apple.teamid;
    let date = new Date();
    let payload = {
      iss: teamId,
      exp: Math.floor(Date.now() / 1000) + (60 * 5),
      iat: Math.floor(+date / 1000)
    };
    let options = {
      algorithm: 'ES256',
      keyid: keyId
    };
    let token = jwt.sign(payload, secret, options);
    res.send(token.toString());
  } else {
    res.send(401);
  }
});

var clientId = functions.config().spotify.clientid;
var clientSecret = functions.config().spotify.clientsecret;
var clientCallback = functions.config().spotify.redirecturi;
var authString = new Buffer(clientId + ':' + clientSecret).toString('base64');
var authorizationHeader = 'Basic ' + authString;
var spotifyEndpoint = 'https://accounts.spotify.com/api/token';

exports.swap = functions.https.onRequest((req, res, next) => {
  var formData = {
      grant_type: 'authorization_code',
      redirect_uri: clientCallback,
      code: req.body.code
    },
    options = {
      uri: url.parse(spotifyEndpoint),
      headers: {
        Authorization: authorizationHeader
      },
      form: formData,
      method: 'POST',
      json: true
    };

  request(options, function (error, response, body) {
    if (error) console.error(error);
    if (response.statusCode === 200) {
      body.refresh_token = encrpytion.encrypt(body.refresh_token);
    }

    res.status(response.statusCode);
    res.json(body);
  });
});

exports.refresh = functions.https.onRequest((req, res, next) => {
  if (!req.body.refresh_token) {
    res.status(400).json({
      error: 'Refresh token is missing from body'
    });
    return;
  }

  var refreshToken = encrpytion.decrypt(req.body.refresh_token),
    formData = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    options = {
      uri: url.parse(spotifyEndpoint),
      headers: {
        Authorization: authorizationHeader
      },
      form: formData,
      method: 'POST',
      json: true
    };

  request(options, function (error, response, body) {
    if (error) console.error(error);
    if (response.statusCode === 200 && !!body.refresh_token) {
      body.refresh_token = encrpytion.encrypt(body.refresh_token);
    }

    res.status(response.statusCode);
    res.json(body);
  });
});
var encSecret = functions.config().spotify.encrpytionsecret || randomstring.generate(30);
class encrpytion {
  encrypt(text) {
    var cipher = crypto.createCipher('aes-256-ctr', encSecret),
      crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }
  decrypt(text) {
    var decipher = crypto.createDecipher('aes-256-ctr', encSecret),
      dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }
}
