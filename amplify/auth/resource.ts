import { referenceAuth } from "@aws-amplify/backend";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 * Reference Existing Auth
 * @see https://docs.amplify.aws/react/build-a-backend/auth/use-existing-cognito-resources/
 */

const USER_POOL_ID = process.env.REACT_APP_USER_POOL_ID;
const IDENTITY_POOL_ID = process.env.REACT_APP_IDENTITY_POOL_ID;
const AUTH_ROLE_ARN = process.env.REACT_APP_AUTH_ROLE_ARN;
const UNAUTH_ROLE_ARN = process.env.REACT_APP_UNAUTH_ROLE_ARN;
const USER_POOL_CLIENT_ID = process.env.REACT_APP_USER_POOL_CLIENT_ID;

if (!USER_POOL_ID || !IDENTITY_POOL_ID || !AUTH_ROLE_ARN || !UNAUTH_ROLE_ARN || !USER_POOL_CLIENT_ID) {
  throw new Error("Missing environment variables");
}

export const auth = referenceAuth({
  // 1.ユーザープールID
  userPoolId: USER_POOL_ID,
  // 2.IDプールID
  identityPoolId: IDENTITY_POOL_ID,
  // 3.認証ロールARN
  authRoleArn: AUTH_ROLE_ARN,
  // 4.非認証ロールARN
  unauthRoleArn: UNAUTH_ROLE_ARN,
  // 5.ユーザープールクライアントID
  userPoolClientId: USER_POOL_CLIENT_ID,
});
