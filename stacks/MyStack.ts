import { StackContext, Api, StaticSite, Table, Config } from "sst/constructs";

export function API({ stack }: StackContext) {

  const CLIENT_ID = new Config.Secret(stack, "CLIENT_ID");
  const CLIENT_SECRET = new Config.Secret(stack, "CLIENT_SECRET");

 const payerTable = new Table(stack, "PayerExtension", {
    fields: {
      payerId: "string",
      hasSelfie: "number",
      selfie: "string"
    },
    primaryIndex: { partitionKey: "payerId", sortKey: "hasSelfie" },//faster lookup to facilitate checking if one is associated with the payerId
  });

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        environment: { SST_STAGE: stack.stage }
      }
    },
    routes: {
      "PUT /enrol-payer-selfie": "packages/functions/src/enrol-selfie.handler",
      "GET /token-proxy": "packages/functions/src/token-proxy.handler",
      "POST /verify-payer-selfie": "packages/functions/src/verify-selfie.handler",
    },
  });
  api.bindToRoute("GET /token-proxy", [CLIENT_ID, CLIENT_SECRET])
  api.bind([payerTable])
  api.attachPermissionsToRoute("POST /verify-payer-selfie", ["rekognition:CompareFaces"])
  api.attachPermissions(["PayerExtension:write", "PayerExtension:read"]);

  
  const web = new StaticSite(stack, "web", {
    path: "packages/web",
    buildOutput: "dist",
    buildCommand: "npm run build",
    environment: {
      VITE_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: web.url,
  });
}
