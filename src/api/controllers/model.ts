// Invoked during:
// * authorization_code grant
// * client_credentials grant
// * refresh_token grant
// * password grant
const generateAccessToken = (
  client: Object,
  user: Object,
  scope: string,
  callback: Function,
): String => {
  return 'accessToken'
}

// Invoked during:
// * authorization_code grant
// * refresh_token grant
// * password grant
const generateRefreshToken = (
  client: Object,
  user: Object,
  scope: string,
  callback: Function,
): String => {
  return 'refreshToken'
}

// Invoked during:
// * authorization_code grant
const generateAuthorizationCode = (
  client: Object,
  user: Object,
  scope: string,
  callback: Function,
): String => {
  return 'authCode'
}

// Invoked during:
// * request authentication
const getAccessToken = (accessToken: string, callback: Function): Object => {
  return {}
}

// Invoked during:
// * refresh_token grant
const getRefreshToken = (refreshToken: string, callback: Function): Object => {
  return {}
}

// Invoked during:
// * authorization_code grant
const getAuthorizationCode = (
  authorizationCode: string,
  callback: Function,
): Object => {
  return {}
}

// Invoked during:
// * authorization_code grant
// * client_credentials grant
// * implicit grant
// * refresh_token grant
// * password grant
const getClient = (
  clientId: string,
  clientSecret: string,
  callback: Function,
): Object => {
  return {}
}

// Invoked during:
// * password grant
const getUser = (username: string, password: string): Object => {
  return {}
}

// Invoked during:
// * client_credentials grant
const getUserFromClient = (client: Object): Object => {
  return {}
}

// Invoked during:
// * authorization_code grant
// * client_credentials grant
// * implicit grant
// * refresh_token grant
// * password grant
const saveToken = (token: Object, client: Object, user: Object): Object => {
  return {}
}

// Invoked during:
// * authorization_code grant
const saveAuthorizationCode = (
  code: Object,
  client: Object,
  user: Object,
): Object => {
  return {}
}

// Invoked during:
// * refresh_token grant
const revokeToken = (token: Object): Boolean => {
  return false
}

// Invoked during:
// * authorization_code grant
const revokeAuthorizationCode = (code: Object): Boolean => {
  return false
}

// Invoked during:
// * authorization_code grant
// * client_credentials grant
// * implicit grant
// * password grant
const validateScope = (user: Object, client: Object, callback: Function) => {}

// Invoked during:
// * request authentication
const verifyScope = (accessToken: Object, scope: string): Boolean => {
  return false
}
