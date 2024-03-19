import { ApiHandler } from 'sst/node/api';
import { Config } from 'sst/node/config';
import { Stitch } from '@spbbite/core/repository'

export const handler = ApiHandler(async (_evt) => {
  console.log(`client_id: ${Config.CLIENT_ID}, secret: ${Config.CLIENT_SECRET}`);//FIXME: logging this is not wise, neat sst feature though
  const response = await Stitch.getSecureToken(Config.CLIENT_ID, Config.CLIENT_SECRET);
  console.log('response: ', response);
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
});
