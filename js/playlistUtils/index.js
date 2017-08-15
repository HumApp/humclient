import firebase from 'firebase';

function savePlaylist(playlists) {
  firebase.database().ref(`/songs`).orderByKey().once('value', songlist => {
    songlist.forEach(song => console.log(song.child('appleId').val()));
    playlists.forEach(playlist => {
      let newPlaylist = {};
      playlist.songs.forEach(song => {
        newPlaylist[findOrCreateSong(song)] = true;
      });
      let newPlaylistId = firebase.database().ref(`playlists/`).push().key;
      firebase.database().ref(`playlists/${newPlaylistId}`).set({
        title: playlist.title,
        creator: firebase.auth().currentUser.uid,
        songs: newPlaylist
      });
    });
  });

  return;
}

function findOrCreateSong(song, songlist, provider) {
  songlist.forEach(firesong => {
    if (
      firesong.child('title').val() === song.title &&
      firesong.child('artist').val() === song.artist
    ) {
      if (!firesong.hasChild(provider)) {
        firesong.database().update({
          [provider]: song.id
        });
        return firesong.key;
      } else {
        const newSongId = firebase.database().ref('/songs').push().key;
        firebase.database().ref(`/songs/${newSongId}`).set({
          [provider]: song.id,
          title: song.title,
          artist: song.artist
        });
        return newSongId;
      }
    }
  });
}
