/*
See LICENSE folder for this sample’s licensing information.

Abstract:
The `MediaLibraryManager` manages creating and updating the `MPMediaPlaylist` that the application creates.
             It also serves as the data source of the `PlaylistTableViewController`
*/

import Foundation
import MediaPlayer

@objc(MediaLibraryManager)
class MediaLibraryManager: NSObject {
    
    // MARK: Types
    
    /// The Key for the `UserDefaults` value representing the UUID of the Playlist this sample creates.
    static let playlistUUIDKey = "playlistUUIDKey"
    
    /// Notification that is posted whenever the contents of the device's Media Library changed.
    static let libraryDidUpdate = Notification.Name("libraryDidUpdate")
    
    // MARK: Properties
    
    /// The instance of `AuthorizationManager` used for looking up the current device's Media Library and Cloud Services authorization status.
  
    /// The instance of `MPMediaPlaylist` that corresponds to the playlist created by this sample in the current device's Media Library.
    var mediaPlaylist: MPMediaPlaylist!
    
    // MARK: Initialization
    
    override init() {
      
        super.init()
        
        // Add the notification observers needed to respond to events from the `AuthorizationManager`, `MPMediaLibrary` and `UIApplication`.
        let notificationCenter = NotificationCenter.default
        
//        notificationCenter.addObserver(self,
//                                       selector: #selector(handleAuthorizationManagerAuthorizationDidUpdateNotification),
//                                       name: AuthorizationManager.authorizationDidUpdateNotification,
//                                       object: nil)
      
//        notificationCenter.addObserver(self,
//                                       selector: #selector(handleMediaLibraryDidChangeNotification),
//                                       name: .MPMediaLibraryDidChange,
//                                       object: nil)
//        
//        notificationCenter.addObserver(self,
//                                       selector: #selector(handleMediaLibraryDidChangeNotification),
//                                       name: .UIApplicationWillEnterForeground,
//                                       object: nil)
//
//        handleAuthorizationManagerAuthorizationDidUpdateNotification()
    }
    
    deinit {
        // Remove all notification observers.
        let notificationCenter = NotificationCenter.default
        
//        notificationCenter.removeObserver(self, name: AuthorizationManager.authorizationDidUpdateNotification, object: nil)
        notificationCenter.removeObserver(self, name: NSNotification.Name.MPMediaLibraryDidChange, object: nil)
        notificationCenter.removeObserver(self, name: NSNotification.Name.UIApplicationWillEnterForeground, object: nil)
    }
    
    @objc func createPlaylistIfNeeded(_ callback: RCTResponseSenderBlock) {
        
        guard mediaPlaylist == nil else { return }
        
        // To create a new playlist or lookup a playlist there are several steps you need to do.
        let playlistUUID: UUID
        
        var playlistCreationMetadata: MPMediaPlaylistCreationMetadata!
        
        let userDefaults = UserDefaults.standard
        let token = UserDefaults.standard.string(forKey: AuthorizationManager.userTokenUserDefaultsKey)
        print(token)
      
        if let playlistUUIDString = userDefaults.string(forKey: MediaLibraryManager.playlistUUIDKey) {
            // In this case, the sample already created a playlist in a previous run.  In this case we lookup the UUID that was used before.
            
            guard let uuid = UUID(uuidString: playlistUUIDString) else {
                fatalError("Failed to create UUID from existing UUID string: \(playlistUUIDString)")
            }
            
            playlistUUID = uuid
            print("playlist", playlistUUID)
        } else {
            // Create an instance of `UUID` to identify the new playlist.
            playlistUUID = UUID()
            
            // Create an instance of `MPMediaPlaylistCreationMetadata`, this represents the metadata to associate with the new playlist.
            playlistCreationMetadata = MPMediaPlaylistCreationMetadata(name: "Hum Playlist")
            
            playlistCreationMetadata.descriptionText = "This playlist was created using \(Bundle.main.infoDictionary!["CFBundleName"]!) to demonstrate how to use the Apple Music APIs"
            
            // Store the `UUID` that the sample will use for looking up the playlist in the future.
            userDefaults.setValue(playlistUUID.uuidString, forKey: MediaLibraryManager.playlistUUIDKey)
            userDefaults.synchronize()
        }
        
        // Request the new or existing playlist from the device.
        MPMediaLibrary.default().getPlaylist(with: playlistUUID, creationMetadata: playlistCreationMetadata) { (playlist, error) in
            guard error == nil else {
                fatalError("An error occurred while retrieving/creating playlist: \(error!.localizedDescription)")
            }
            self.mediaPlaylist = playlist
            self.addItem(with: "203709340")
            NotificationCenter.default.post(name: MediaLibraryManager.libraryDidUpdate, object: nil)
        }
        let myPlaylistQuery = MPMediaQuery.playlists()
        let playlists = myPlaylistQuery.collections
//        let firstPlaylist = playlists![0]
//      firstPlaylist.artwork
//        print(firstPlaylist.value(forProperty: MPMediaPlaylistPropertyPersistentID)!)
//          print(firstPlaylist.)
//        var dictOfPlaylists =  [String : [String : [String]]] ()
        var jsonString = "{"
          for playlist in playlists! {
//            print(playlist.value(forProperty: MPMediaPlaylistPropertyName)!)
//            print(playlist.value(forProperty: MPMediaPlaylistCreationMetadata)!)
            jsonString += "\"" + String(describing: playlist.value(forProperty: MPMediaPlaylistPropertyName)!) + "\"" + ":" + "["
            let songs = playlist.items
//            var dictOfSongs =  [String : [String]] ()
            for song in songs {
              let title = String(describing: song.value(forProperty: MPMediaItemPropertyTitle)!)
              let artist = String(describing: song.value(forProperty: MPMediaItemPropertyArtist)!)
//              let songInfoArr: [String] = [title, artist]
              let songId = String(describing: song.value(forProperty: MPMediaItemPropertyPlaybackStoreID)!)
              jsonString += "{" + "id: " + songId + ", " + "title: " + "\"" + title + "\"" + ", " + "artist: " + "\"" + artist + "\"" + "},"
//              dictOfSongs[songId] = songInfoArr
  //            print("\t\t", song.value(forProperty: MPMediaItemPropertyArtist)!)
            }
            jsonString += "],"
//            dictOfPlaylists[String(describing: playlist.value(forProperty: MPMediaPlaylistPropertyName)!)] = dictOfSongs
          }
          jsonString += "}"
        callback([jsonString])
    }
    
    // MARK: Playlist Modification Method
    
    func addItem(with identifier: String) {
        
        guard let mediaPlaylist = mediaPlaylist else {
            fatalError("Playlist has not been created")
        }
        
        mediaPlaylist.addItem(withProductID: identifier, completionHandler: { (error) in
            guard error == nil else {
                fatalError("An error occurred while adding an item to the playlist: \(error!.localizedDescription)")
            }
            
            NotificationCenter.default.post(name: MediaLibraryManager.libraryDidUpdate, object: nil)
        })
    }
    
    // MARK: Notification Observing Methods
    
//    func handleAuthorizationManagerAuthorizationDidUpdateNotification() {
//
//        if MPMediaLibrary.authorizationStatus() == .authorized {
//            createPlaylistIfNeeded(_ callback: RCTResponseSenderBlock)
//        }
//    }
//
//    func handleMediaLibraryDidChangeNotification() {
//
//        if MPMediaLibrary.authorizationStatus() == .authorized {
//            createPlaylistIfNeeded(_ callback: RCTResponseSenderBlock)
//        }
//
//        NotificationCenter.default.post(name: MediaLibraryManager.libraryDidUpdate, object: nil)
//    }
}
