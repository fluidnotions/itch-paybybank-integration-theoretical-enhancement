import { createContext, useContext } from "react";
import { GraphqlClient, HttpClient, ImageCaptureHelper } from "../services";
import EventEmitter from "eventemitter3";
import { StepName } from ".";
import get from "lodash/get";

/**
 * Not the best way to handle context, but it was fast and easy to implement for an mre
 */
export class MainContext {
  public graphqlClient: GraphqlClient | null = null;
  public imageCaptureHelper = new ImageCaptureHelper();

  async init() {
    const token = await HttpClient.getStitchToken();
    this.graphqlClient = new GraphqlClient(token);
  }

  public handleOptIn: any | null = null;
  public optIn: boolean | null = null;
  public payerId: string | null = null;
  
  private getBaseUrlWithoutPath() {
    const { hostname, port } = window.location;
    const portPart = port ? `:${port}` : '';
    return `https://${hostname}${portPart}`;
  }

  private _paymentRequestUrl = this.getBaseUrlWithoutPath()
  public set paymentRequestUrl(v: string){
    console.log('setting paymentRequestUrl: ', v)
    console.log('_paymentRequestUrl base: ', this._paymentRequestUrl)
    // this._paymentRequestUrl = v + `?redirect_uri=${this._paymentRequestUrl}/return`
    //FIXME: not sure how to deploy this with the testing whitelist of redirect_uris, but since I found a hacky work around I suppose I can
    //just as long as everyone knows I'd never do this for production
    this._paymentRequestUrl = v + `?redirect_uri=https://localhost:8000/return`
    console.log(this._paymentRequestUrl)
  }
  public get paymentRequestUrl(): string {
    return this._paymentRequestUrl
  }
  private payerCreated = false

  public async next(stepName: string) {
    await this.call(stepName).catch(console.error);
  }

  public async selfieVerified(): Promise<boolean> {
    const response = await HttpClient.verifySelfie(
      this.payerId!,
      this.imageCaptureHelper.reviewSelfieImageStr!
    );
    const similarity: number = get(response, "FaceMatches[0].Similarity");
    console.log("similarity: ", similarity);
    return similarity > 90;
  }

  private async call(nextStepName: string) {
    switch (nextStepName) {
      case StepName.ENROL_FACIAL_ID:
        await HttpClient.createPayer(this.payerId!);
        this.payerCreated = true
        break;
      case StepName.VERIFY_FACIAL_ID:
        await HttpClient.enrolSelfie(
          this.payerId!,
          this.imageCaptureHelper.reviewSelfieImageStr!
        );
        break;
      case StepName.PROCEED_TO_PAYMENT:
        this.imageCaptureHelper.stopVideoStream();
        if (!this.payerCreated) {
          await HttpClient.createPayer(this.payerId!);
        }  
        
        const paymentRequestResponse =
          await this.graphqlClient?.createPaymentRequest();
        console.log("paymentRequestResponse: ", paymentRequestResponse, ', loc: ', window.location.href)
        this.paymentRequestUrl = get(paymentRequestResponse, 'clientPaymentInitiationRequestCreate.paymentInitiationRequest.url')  
        break;
    }
  }
}

export const ReactMainContext = createContext<MainContext>(new MainContext());

export const useMainContext = (): MainContext => {
  return useContext(ReactMainContext);
};

/**
 * Using events in react is atypical.
 * Could have used callbacks instead.
 * I usually clean up, but for this MRE I'm leaving it as is.
 */
export const emitter = new EventEmitter();
