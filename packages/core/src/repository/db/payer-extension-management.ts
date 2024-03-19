import { Model } from "dynamoose/dist/Model";
import * as dynamoose from "dynamoose";
import { PayerExtension, PayerExtensionSchema } from "./entities";


export class PayerExtensionManagement {
  constructor(private entity: Model<PayerExtension>) { }

  async createPayer(user: Partial<PayerExtension>) {
    const res = await this.entity.create(user);
    console.log('PayerExtensionManagement : createPayer : res', res)
    return res
  }

  async getPayer(payerId: string) {
    const res = await this.entity.get({ payerId: payerId, hasSelfie: 1 });
    console.log('PayerExtensionManagement : getPayer : res', res)
    return res
  }

}
export const PayerManagementInstance = (): PayerExtensionManagement => {
  //FIXME: handling this stage dep prefix through env vars would be better than hardcoding it
  const stage = process.env.SST_STAGE
  return new PayerExtensionManagement(dynamoose.model(`${stage}-spbbite-PayerExtension`, PayerExtensionSchema));
}