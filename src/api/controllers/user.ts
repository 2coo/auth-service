import passport from 'passport'
import Express from 'express'

//  * GET /api/userinfo
//  * Host: https://localhost:3000
//  * Authorization: Bearer someAccessTokenHere
export const info = [
  passport.authenticate('bearer', {
    session: false,
  }),
  (req: Express.Request, res: Express.Response) => {
    res.json(req.user)
  },
]
