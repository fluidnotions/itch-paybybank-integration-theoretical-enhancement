import { ApiHandler } from 'sst/node/api';
import { PayerManagementInstance } from '@spbbite/core/repository'
import { Body } from './types';

const payer = PayerManagementInstance(); // cached outside lambda

export const handler = ApiHandler(async (_evt) => {
  let body: Body | undefined;
  try {
    body = JSON.parse(_evt.body!);
  } catch { }
  console.log('body: ', JSON.stringify(body))

  if (!body || !body.payerId) {//FIXME: better to use a payload schema
    console.log('Invalid request, missing required fields')
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request' })
    };
  }

  try {
    const result = await payer.createPayer({ ...body, hasSelfie: !!body.selfie ? 1 : 0 })
    console.log('create player result: ', result.toJSON())
  } catch (err: any) {
    console.log('error creating payer entity, ', err.message)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Db error' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: !!body.selfie ? 'Payer Updated' : 'Payer created' }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  }
});