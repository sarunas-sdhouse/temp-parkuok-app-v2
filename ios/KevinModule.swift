import SwiftUI
import Kevin

@objc(KevinModule)
class KevinModule: NSObject, KevinAccountLinkingSessionDelegate {

  private var callback: RCTResponseSenderBlock?
    
  override init() {
    super.init()
    
    //  enable deep linking
    Kevin.shared.isDeepLinkingEnabled = true
    // Setup your custom theme which extends KevinTheme
    Kevin.shared.theme = KevinTheme()
    // Set optional locale, default is English locale
    Kevin.shared.locale = Locale(identifier: "en")
    // Initialize required plugins with your callback urls
    KevinAccountsPlugin.shared.configure(
      KevinAccountsConfiguration.Builder(
        callbackUrl: URL(string: "https://your.callback.url")!
      ).build()
    )
    KevinInAppPaymentsPlugin.shared.configure(
      KevinInAppPaymentsConfiguration.Builder(
        callbackUrl: URL(string: "https://your.callback.url")!
      ).build()
    )
  }

  @objc(openKevinAccountLinking::)
  func openKevinAccountLinking(state: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    do {
      KevinAccountLinkingSession.shared.delegate = self
      try KevinAccountLinkingSession.shared.initiateAccountLinking(
        configuration: KevinAccountLinkingSessionConfiguration.Builder(
          state: state
        )
          .setPreselectedCountry(.lithuania)
          .setCountryFilter([.lithuania, .latvia, .estonia])
          .setSkipBankSelection(false)
          .build()
      )
      
      self.callback = callback
    } catch {
      callback(["Failed", nil])
    }
  }

  func onKevinAccountLinkingStarted(controller: UINavigationController) {
    let rootViewController = UIApplication.shared.windows.first!.rootViewController
    rootViewController?.present(controller, animated: true, completion: nil)
  }
    
  func onKevinAccountLinkingCanceled(error: Error?) {
    callback?(["Failed", nil])
  }
  
  func onKevinAccountLinkingSucceeded(authorizationCode: String, bank: ApiBank) {
    callback?([nil, authorizationCode])
  }

  @objc(openKevinBankPayment::)
  func openKevinBankPayment(id: String, callback: @escaping RCTResponseSenderBlock) -> Void {
    do {
      KevinPaymentSession.shared.delegate = self
      try KevinPaymentSession.shared.initiatePayment(
        configuration: KevinPaymentSessionConfiguration.Builder(
          paymentId: id
        )
          .setPreselectedCountry(.lithuania)
          .setSkipBankSelection(false)
          .build()
      )
      
      self.callback = callback
    } catch {
      callback(["Failed", nil])
    }
  }

  func onKevinPaymentInitiationStarted(controller: UINavigationController) {
        let rootViewController = UIApplication.shared.windows.first!.rootViewController
        rootViewController?.present(controller, animated: true, completion: nil)
    }
    
    func onKevinPaymentCanceled(error: Error?) {
        callback?(["Failed", nil])
    }
    
    func onKevinPaymentSucceeded(paymentId: String) {
        callback?([nil, paymentId])
    }
}