import Express from 'express'
import passport from 'passport'

export const info = [
  passport.authenticate('bearer', {
    session: false,
  }),
  (req: Express.Request, res: Express.Response) => {
    res.json(req.user)
  },
]
