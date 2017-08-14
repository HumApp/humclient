import firebase from 'firebase';

function savePlaylist(playlists) {
  Object.keys(playlists).forEach(key => {
    let newPlaylistId = firebase.database().ref(`playlists/`).push().key;
  });
  return;
}

let obj = {
  playlistOne: {
    songs: [
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      },
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      },
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      },
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      }
    ]
  },
  playlistTwo: {
    songs: [
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      },
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      },
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      },
      {
        songName: 'NAME',
        artist: 'ARTIST',
        appleId: '21324324'
      }
    ]
  }
};
