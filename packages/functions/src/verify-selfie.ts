import { ApiHandler } from 'sst/node/api';
import { Rekognition } from 'aws-sdk';
import { PayerManagementInstance } from '@spbbite/core/repository'
import { Body } from './types';

const rekognition = new Rekognition();
const payer = PayerManagementInstance(); // cached outside lambda

export const handler = ApiHandler(async (_evt) => {
  let body: Body | undefined;
  try {
    body = JSON.parse(_evt.body!);
  } catch { }

  if (!body || !body.payerId || !body.selfie) {//FIXME: better to use a payload schema
    return {
      statusCode: 400,
      body: 'Invalid request'
    };
  }
  let response: Rekognition.CompareFacesResponse | undefined
  try {
    const payerEntity = await payer.getPayer(body.payerId);
    console.log('payerEntity: ', payerEntity)
    const sourceImage = {
      Bytes: Buffer.from(payerEntity.selfie.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    }
    const targetImage = {
      Bytes: Buffer.from(body.selfie.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    }
    // Call Rekognition's compareFaces method
    response = await rekognition.compareFaces({
      SourceImage: sourceImage,
      TargetImage: targetImage,
    }).promise();
    console.log('response from rekognition: ', response)
  } catch (err: any) {
    console.log('error looking up payer entity/calling compareFaces service: ', err.message)
    return {
      statusCode: 500,
      body: err.message
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});