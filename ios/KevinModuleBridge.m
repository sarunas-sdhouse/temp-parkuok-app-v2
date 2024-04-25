#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(KevinModule, NSObject)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXTERN_METHOD(openKevinAccountLinking:(NSString):(RCTResponseSenderBlock))

RCT_EXTERN_METHOD(openKevinBankPayment:(NSString):(RCTResponseSenderBlock))

@end