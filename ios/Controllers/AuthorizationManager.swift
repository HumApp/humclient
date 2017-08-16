/*
See LICENSE folder for this sample’s licensing information.

Abstract:
`AuthorizationManager` manages requesting authorization from the user for modifying the user's `MPMediaLibrary` and querying
             the currently logged in iTunes Store account's Apple Music capabilities.
*/

import Foundation
import StoreKit
import MediaPlayer


@objc(AuthorizationManager)
class AuthorizationManager: NSObject {
    
    // MARK: Types
    
    /// Notification that is posted whenever there is a change in the capabilities or Storefront identifier of the `SKCloudServiceController`.
    static let cloudServiceDidUpdateNotification = Notification.Name("cloudServiceDidUpdateNotification")
    
    /// Notification that is posted whenever there is a change in the authorization status that other parts of the sample should respond to.
    static let authorizationDidUpdateNotification = Notification.Name("authorizationDidUpdateNotification")
    
    /// The `UserDefaults` key for storing and retrieving the Music User Token associated with the currently signed in iTunes Store account.
    static let userTokenUserDefaultsKey = "UserTokenUserDefaultsKey"
    
    // MARK: Properties
    
    /// The instance of `SKCloudServiceController` that will be used for querying the available `SKCloudServiceCapability` and Storefront Identifier.
    let cloudServiceController = SKCloudServiceController()
    
    /// The instance of `AppleMusicManager` that will be used for querying storefront information and user token.
//    let appleMusicManager: AppleMusicManager
  
    /// The current set of `SKCloudServiceCapability` that the sample can currently use.
    var cloudServiceCapabilities = SKCloudServiceCapability()
    
    /// The current set of two letter country code associated with the currently authenticated iTunes Store account.
    var cloudServiceStorefrontCountryCode = ""
    
    /// The Music User Token associated with the currently signed in iTunes Store account.
    var userToken = ""
  
    /// The completion handler that is called when an Apple Music Get User Storefront API call completes.
    typealias GetUserStorefrontCompletionHandler = (_ storefront: String?, _ error: Error?) -> Void
  
    lazy var urlSession: URLSession = {
      // Configure the `URLSession` instance that is going to be used for making network calls.
      let urlSessionConfiguration = URLSessionConfiguration.default
      
      return URLSession(configuration: urlSessionConfiguration)
    }()
    
    // MARK: Initialization
    
    override init() {
//        self.appleMusicManager = appleMusicManager
      
        super.init()
        
        let notificationCenter = NotificationCenter.default
        
        /*
         It is important that your application listens to the `SKCloudServiceCapabilitiesDidChangeNotification` and
         `SKStorefrontCountryCodeDidChangeNotification` notifications so that your application can update its state and functionality
         when these values change if needed.
        */
        
        notificationCenter.addObserver(self,
                                       selector: #selector(requestCloudServiceCapabilities),
                                       name: .SKCloudServiceCapabilitiesDidChange,
                                       object: nil)
        if #available(iOS 11.0, *) {
            notificationCenter.addObserver(self,
                                           selector: #selector(requestStorefrontCountryCode),
                                           name: .SKStorefrontCountryCodeDidChange,
                                           object: nil)
        }
      
        /*
         If the application has already been authorized in a previous run or manually by the user then it can request
         the current set of `SKCloudServiceCapability` and Storefront Identifier.
        */
        if SKCloudServiceController.authorizationStatus() == .authorized {
            requestCloudServiceCapabilities()
            
            /// Retrieve the Music User Token for use in the application if it was stored from a previous run.
            if let token = UserDefaults.standard.string(forKey: AuthorizationManager.userTokenUserDefaultsKey) {
                userToken = token
            } else {
                /// The token was not stored previously then request one.
                requestUserToken()
            }
        }
    }
    
    deinit {
        // Remove all notification observers.
        let notificationCenter = NotificationCenter.default
        
        notificationCenter.removeObserver(self, name: .SKCloudServiceCapabilitiesDidChange, object: nil)
        
        if #available(iOS 11.0, *) {
            notificationCenter.removeObserver(self, name: .SKStorefrontCountryCodeDidChange, object: nil)
        }
        
    }
    
    // MARK: Authorization Request Methods
    
  @objc func requestCloudServiceAuthorization(_ callback: RCTResponseSenderBlock) {
        /*
         An application should only ever call `SKCloudServiceController.requestAuthorization(_:)` when their
         current authorization is `SKCloudServiceAuthorizationStatusNotDetermined`
         */
        let status = SKCloudServiceController.authorizationStatus()
        guard SKCloudServiceController.authorizationStatus() == .notDetermined else { return }
        
        /*
         `SKCloudServiceController.requestAuthorization(_:)` triggers a prompt for the user asking if they wish to allow the application
         that requested authorization access to the device's cloud services information.  This allows the application to query information
         such as the what capabilities the currently authenticated iTunes Store account has and if the account is eligible for an Apple Music
         Subscription Trial.
         
         This prompt will also include the value provided in the application's Info.plist for the `NSAppleMusicUsageDescription` key.
         This usage description should reflect what the application intends to use this access for.
         */
        
        SKCloudServiceController.requestAuthorization { [weak self] (authorizationStatus) in
            switch authorizationStatus {
            case .authorized:
                self?.requestCloudServiceCapabilities()
                self?.requestUserToken()
            default:
                break
            }
            
            NotificationCenter.default.post(name: AuthorizationManager.authorizationDidUpdateNotification, object: nil)
        }
        callback(["cloud service"])
    }
    
  @objc func requestMediaLibraryAuthorization(_ callback: @escaping RCTResponseSenderBlock) {
        /*
         An application should only ever call `MPMediaLibrary.requestAuthorization(_:)` when their
         current authorization is `MPMediaLibraryAuthorizationStatusNotDetermined`
         */
        guard MPMediaLibrary.authorizationStatus() == .notDetermined else { return }
        
        /*
         `MPMediaLibrary.requestAuthorization(_:)` triggers a prompt for the user asking if they wish to allow the application
         that requested authorization access to the device's media library.
         
         This prompt will also include the value provided in the application's Info.plist for the `NSAppleMusicUsageDescription` key.
         This usage description should reflect what the application intends to use this access for.
         */
        
        MPMediaLibrary.requestAuthorization { (_) in
            NotificationCenter.default.post(name: AuthorizationManager.cloudServiceDidUpdateNotification, object: nil)
            callback(["media player"])
        }
    
    }
    
    // MARK: `SKCloudServiceController` Related Methods
    
    func requestCloudServiceCapabilities() {
        cloudServiceController.requestCapabilities(completionHandler: { [weak self] (cloudServiceCapability, error) in
            guard error == nil else {
                fatalError("An error occurred when requesting capabilities: \(error!.localizedDescription)")
            }
            
            self?.cloudServiceCapabilities = cloudServiceCapability
            
            NotificationCenter.default.post(name: AuthorizationManager.cloudServiceDidUpdateNotification, object: nil)
        })
    }
  
    func fetchDeveloperToken() -> String? {
      
      // MARK: ADAPT: YOU MUST IMPLEMENT THIS METHOD
      let developerAuthenticationToken: String? = "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikw4RE05UjJDWVYifQ.eyJpc3MiOiJMTlEyMllGOFVCIiwiaWF0IjoxNTAyNzMwNTIxLCJleHAiOjE1MDI3NzM3MjF9.EGXZJbw1W-oeVbRoLeMxwHYcHYCeot9IzzuB-8MUQj7tjAjCMCl-SFV6MLKPoEype4UkHbKz6uDQrv9gZF0s4w"
      return developerAuthenticationToken
    }
  
  func performAppleMusicGetUserStorefront(userToken: String, completion: @escaping GetUserStorefrontCompletionHandler) {
    guard let developerToken = fetchDeveloperToken() else {
      fatalError("Developer Token not configured.  See README for more details.")
    }
    
    let urlRequest = AppleMusicRequestFactory.createGetUserStorefrontRequest(developerToken: developerToken, userToken: userToken)
    
    let task = urlSession.dataTask(with: urlRequest) { [weak self] (data, response, error) in
      guard error == nil, let urlResponse = response as? HTTPURLResponse, urlResponse.statusCode == 200 else {
        let error = NSError(domain: "AppleMusicManagerErrorDomain", code: -9000, userInfo: [NSUnderlyingErrorKey: error!])
        
        completion(nil, error)
        
        return
      }
      
      do {
        
        let identifier = try self?.processStorefront(from: data!)
        
        completion(identifier, nil)
      } catch {
        fatalError("An error occurred: \(error.localizedDescription)")
      }
    }
    
    task.resume()
  }
  
    func processStorefront(from json: Data) throws -> String {
      guard let jsonDictionary = try JSONSerialization.jsonObject(with: json, options: []) as? [String: Any],
        let data = jsonDictionary[ResponseRootJSONKeys.data] as? [[String: Any]] else {
          throw SerializationError.missing(ResponseRootJSONKeys.data)
      }
      
      guard let identifier = data.first?[ResourceJSONKeys.identifier] as? String else {
        throw SerializationError.missing(ResourceJSONKeys.identifier)
      }
      
      return identifier
    }
  
    func performAppleMusicStorefrontsLookup(regionCode: String, completion: @escaping GetUserStorefrontCompletionHandler) {
      guard let developerToken = fetchDeveloperToken() else {
        fatalError("Developer Token not configured. See README for more details.")
      }
      
      let urlRequest = AppleMusicRequestFactory.createStorefrontsRequest(regionCode: regionCode, developerToken: developerToken)
      
      let task = urlSession.dataTask(with: urlRequest) { [weak self] (data, response, error) in
        guard error == nil, let urlResponse = response as? HTTPURLResponse, urlResponse.statusCode == 200 else {
          completion(nil, error)
          return
        }
        
        do {
          let identifier = try self?.processStorefront(from: data!)
          completion(identifier, nil)
        } catch {
          fatalError("An error occurred: \(error.localizedDescription)")
        }
      }
      
      task.resume()
    }
  
    func requestStorefrontCountryCode() {
        let completionHandler: (String?, Error?) -> Void = { [weak self] (countryCode, error) in
            guard error == nil else {
                print("An error occurred when requesting storefront country code: \(error!.localizedDescription)")
                return
            }
            
            guard let countryCode = countryCode else {
                print("Unexpected value from SKCloudServiceController for storefront country code.")
                return
            }
            
            self?.cloudServiceStorefrontCountryCode = countryCode
            
            NotificationCenter.default.post(name: AuthorizationManager.cloudServiceDidUpdateNotification, object: nil)
        }
        
        if SKCloudServiceController.authorizationStatus() == .authorized {
            if #available(iOS 11.0, *) {
                /*
                 On iOS 11.0 or later, if the `SKCloudServiceController.authorizationStatus()` is `.authorized` then you can request the storefront
                 country code.
                 */
                cloudServiceController.requestStorefrontCountryCode(completionHandler: completionHandler)
            } else {
                self.performAppleMusicGetUserStorefront(userToken: userToken, completion: completionHandler)
            }
        } else {
            determineRegionWithDeviceLocale(completion: completionHandler)
        }
    }
  
  
    func requestUserToken() {
        guard let developerToken = self.fetchDeveloperToken() else {
            return
        }

        if SKCloudServiceController.authorizationStatus() == .authorized {
            
            let completionHandler: (String?, Error?) -> Void = { [weak self] (token, error) in
                guard error == nil else {
                    print("An error occurred when requesting user token: \(error!.localizedDescription)")
                    return
                }
//
                guard let token = token else {
                    print("Unexpected value from SKCloudServiceController for user token.")
                    return
                }
              
                self?.userToken = token
                /// Store the Music User Token for future use in your application.
                let userDefaults = UserDefaults.standard
                userDefaults.set(token, forKey: AuthorizationManager.userTokenUserDefaultsKey)
                userDefaults.synchronize()
                
                if self?.cloudServiceStorefrontCountryCode == "" {
                    self?.requestStorefrontCountryCode()
                }
                
                NotificationCenter.default.post(name: AuthorizationManager.cloudServiceDidUpdateNotification, object: nil)
            }
            
            if #available(iOS 11.0, *) {
                cloudServiceController.requestUserToken(forDeveloperToken: developerToken, completionHandler: completionHandler)
            } else {
                cloudServiceController.requestPersonalizationToken(forClientToken: developerToken, withCompletionHandler: completionHandler)
            }
        }
    }
    
    func determineRegionWithDeviceLocale(completion: @escaping (String?, Error?) -> Void) {
        /*
         On other versions of iOS or when `SKCloudServiceController.authorizationStatus()` is not `.authorized`, your application should use a
         combination of the device's `Locale.current.regionCode` and the Apple Music API to make an approximation of the storefront to use.
         */
        
        let currentRegionCode = Locale.current.regionCode?.lowercased() ?? "us"
        
        self.performAppleMusicStorefrontsLookup(regionCode: currentRegionCode, completion: completion)
    }
}
