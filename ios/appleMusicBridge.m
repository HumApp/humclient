//
//  reactBridge.m
//  applemusic
//
//  Created by Olivia Oddo on 8/12/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AuthorizationManager, NSObject)

RCT_EXTERN_METHOD(requestCloudServiceAuthorization: (RCTResponseSenderBlock)callback);
RCT_EXTERN_METHOD(requestMediaLibraryAuthorization: (RCTResponseSenderBlock)callback);

@end


@interface RCT_EXTERN_MODULE(MediaLibraryManager, NSObject)

RCT_EXTERN_METHOD(createPlaylistIfNeeded: (RCTResponseSenderBlock)callback);
RCT_EXTERN_METHOD(getPlaylists: (RCTResponseSenderBlock)callback);

@end

