import { Application } from '@prisma/client'
import Axios from 'axios'
import { NextFunction, Response } from 'express'
import passport from 'passport'

export const ensureLoggedIn = () => async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const defaultApp: Application = req.session.defaultApp
  const failureRedirect = `/oauth2/authorize?response_type=code&redirect_uri=/login&client_id=${defaultApp.id}`
  return passport.authenticate('jwt', {
    session: false,
    scope: ['openid', 'email', 'profile'],
    successRedirect: "/account",
    failureRedirect: failureRedirect,
  })(req, res, next)
}

export const getKIDfromAccessToken = (accessToken: string) => {
  const tokenSections = accessToken.split('.')
  if (tokenSections.length < 2) {
    throw new Error('requested token is invalid')
  }
  const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8')
  const header = JSON.parse(headerJSON)
  return header.kid
}

export const authCodeCallback = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const defaultApp: Application = req.session.defaultApp
  const host = req.protocol + '://' + req.get('host')
  const { code } = req.query
  if (code) {
    const basicAuth = new Buffer(
      `${defaultApp.id}:${defaultApp.secret}`,
    ).toString('base64')
    const tokens = (
      await Axios.post(
        `${host}/oauth2/token`,
        {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: '/login',
        },
        {
          headers: {
            Authorization: `Basic ${basicAuth}`,
          },
        },
      )
    ).data
    if (tokens.access_token) {
      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
      })
    }
    if (tokens.refresh_token) {
      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
      })
    }
    return res.redirect('/login')
  }
  return next()
}
