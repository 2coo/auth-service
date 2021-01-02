import * as queryString from 'query-string'
import axios from 'axios'

export const getAuthorizeURL = (
  clientId: string,
  scope: string,
  redirect_uri: string,
  state: string,
) => {
  const stringifiedParams = queryString.stringify({
    client_id: clientId,
    redirect_uri: redirect_uri,
    scope: scope,
    response_type: 'code',
    state: Buffer.from(state).toString('base64'),
  })
  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?${stringifiedParams}`
  return googleLoginUrl
}

export const getAccessTokenFromCode = async (
  code: string,
  clientId: string,
  clientSecret: string,
  redirect_uri: string,
) => {
  const { data } = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
      code,
    },
  })
  return data.access_token
}

export const getGoogleUserInfo = async (access_token: string) => {
  const { data } = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  console.log(data) // { id, email, given_name, family_name }
  return data
}
