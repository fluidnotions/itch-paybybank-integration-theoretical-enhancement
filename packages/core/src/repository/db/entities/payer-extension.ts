import { Item } from "dynamoose/dist/Item";
import * as dynamoose from "dynamoose";

export class PayerExtension extends Item {
    payerId!: string;
    hasSelfie!: number;
    selfie!: string;
}

//FIXME: storing a base 64 encoded string in the db isn't ideal. An encrypted s3 bucket of a binary attribute would be better
export const PayerExtensionSchema = new dynamoose.Schema({
    payerId: {
        type: String,
        hashKey: true, // Specifies this as the partition key
    },
    hasSelfie: {
        type: Number,
        rangeKey: true, // Specifies this as the sort key
    },
    "selfie": String,
}, {
    "saveUnknown": true,
    "timestamps": true
});