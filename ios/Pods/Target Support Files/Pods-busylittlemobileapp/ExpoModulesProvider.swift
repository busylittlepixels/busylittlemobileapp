/**
 * Automatically generated by expo-modules-autolinking.
 *
 * This autogenerated class provides a list of classes of native Expo modules,
 * but only these that are written in Swift and use the new API for creating Expo modules.
 */

import ExpoModulesCore
import Expo
import EXApplication
import ExpoAsset
import ExpoCamera
import EXConstants
import ExpoDevice
import EASClient
import ExpoFileSystem
import ExpoFont
import ExpoImagePicker
import ExpoKeepAwake
import ExpoLinking
import ExpoHead
import ExpoSplashScreen
import ExpoSystemUI
import EXUpdates
import ExpoWebBrowser

@objc(ExpoModulesProvider)
public class ExpoModulesProvider: ModulesProvider {
  public override func getModuleClasses() -> [AnyModule.Type] {
    return [
      ExpoFetchModule.self,
      ApplicationModule.self,
      AssetModule.self,
      CameraViewModule.self,
      ConstantsModule.self,
      DeviceModule.self,
      EASClientModule.self,
      FileSystemModule.self,
      FileSystemNextModule.self,
      FontLoaderModule.self,
      ImagePickerModule.self,
      KeepAwakeModule.self,
      ExpoLinkingModule.self,
      ExpoHeadModule.self,
      SplashScreenModule.self,
      ExpoSystemUIModule.self,
      UpdatesModule.self,
      WebBrowserModule.self
    ]
  }

  public override func getAppDelegateSubscribers() -> [ExpoAppDelegateSubscriber.Type] {
    return [
      FileSystemBackgroundSessionHandler.self,
      LinkingAppDelegateSubscriber.self,
      ExpoHeadAppDelegateSubscriber.self,
      SplashScreenAppDelegateSubscriber.self
    ]
  }

  public override func getReactDelegateHandlers() -> [ExpoReactDelegateHandlerTupleType] {
    return [
      (packageName: "expo-updates", handler: ExpoUpdatesReactDelegateHandler.self)
    ]
  }

  public override func getAppCodeSignEntitlements() -> AppCodeSignEntitlements {
    return AppCodeSignEntitlements.from(json: #"{}"#)
  }
}
