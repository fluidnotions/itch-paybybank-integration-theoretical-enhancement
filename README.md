# Itch PayByBank Integration Theoretical Enhancement 
Facial Verification for one-click transactions across different browsers and devices

## Overview

This PayByBank Integration POC proposes an innovative solution to enhance the PayByBank integration, addressing the limitation of one-click transactions being restricted [example competitor docs](https://docs.stitch.money/payment-products/payins/paybybank/integration-process#saving-bank-accounts-per-user) to the same browser. 
By introducing an opt-in facial authentication feature, we can offer payers the convenience of one-click transactions across different browsers and devices.

## Solution

**Friction Reduction**: Many payers don't know their banking profile login details by heart, this is the reason why the one-click transactions is so advantageous for user experience. However many payers also use multiple devices. Capturing a selfie on desktop or mobile is faster than expecting them to re-enter their banking profile login details, on a new device browser, enabling them to leverage one-click transactions on all devices they access, perhaps not even there own device, in the case of a single use token implementation variant.

### Facial Verification Process

- **Payer Opt-In**: Payers can opt into facial verification by taking a selfie within the web app, which is securely stored. Liveness could also can be incorporated, during initial enrolment, using multiple frames, from the video capture stream. These would be gray-scale and not stored, just used to establish liveness, during enrolment. With a single color image stored.
- **Cross-Browser One-Click Transactions**: When initiating a payment from a different browser, the system detects if the payerId has no token stored locally in the browser and has a selfie on record.
- **Selfie Verification**: Payers are prompted to verify their identity with a new selfie. Upon successful verification, a payment token which is generated on the backend within the itch integration, can be stored locally by the frontend, thereby restoring one-click transactions functionality, on a new device or browser.
- **Feature Considerations**:
Given security concerns weighed against how quickly this can be done, it's worth considering if it should be a single use token or if the payer should be asked if the device is their own, if they confirm, it could be a multiple use token as is the case with same device browser default one-click transactions functionality.   


### Implementation as POC

This feature is presented as a proof of concept (POC) to demonstrate a potential solution to enhance UX and value proposition to integrators. It's important to note that this implementation is not currently supported by the existing itch PayByBank integration (at least it is not mentioned in the developer documentation) and serves as a theoretical enhancement. The implementation reflects this as the selfie is store by the integrator in this case rather than be part of the integration which is obviously inaccessible to the author.

### Considerations

- **Privacy and Security**: Ensures compliance with data protection regulations, using encrypted storage for biometric data. The solution doesn't expose the integration to additional security risks beyond the risks inherent in allowing one-click transactions on the same device and browser. By introducing fast, frictionless facial payer identity verification which equates to the same or greater assurance that the payer is the account holder or an authorized proxy in the case of B2B payments.
- **Cost-Benefit Analysis**: It is acknowledged that further analysis is required to evaluate the feasibility and benefits of implementing this feature.

## Conclusion

This proposal outlines a creative approach to overcoming the limitations of one-click transactions in itch PayByBank integration. By leveraging facial verification, we can provide a more flexible and secure payment experience for payers across different browsers or different devices. 

## Caveats

- There are several, this was a very quick MRE.
- All with fairly obvious solutions
- I'm not going to list them all here

## Viewing and Concept Use

Welcome to this public repository! Here, you'll find a minimal reproduction example of a concept I've been developing. This concept is very close to my heart, and while I'm excited to share it for viewing, I kindly ask that it not be reused or adapted without my express permission. If my concept sparks an idea or you're interested in collaboration, feel free to reach out to me. Let's chat about the possibilities!


