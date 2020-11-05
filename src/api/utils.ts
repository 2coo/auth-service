import { ensureLoggedIn } from 'connect-ensure-login'
import Express from 'express'

export const ensureLoginWithPoolIdentifier = (
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
) => ensureLoggedIn(`${req.baseUrl}/login`)(req, res, next)
