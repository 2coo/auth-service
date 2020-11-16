import { ensureLoggedIn } from 'connect-ensure-login'
import Express from 'express'

export const ensureLoginWithPoolIdentifier = (
  options: string | any | null = null,
) => {
  if (typeof options == 'string') {
    options = { redirectTo: options }
  }
  options = options || {}

  var url = options.redirectTo || '/login'
  var setReturnTo =
    options.setReturnTo === undefined ? true : options.setReturnTo
  return function (
    req: Express.Request,
    res: Express.Response,
    next: Express.NextFunction,
  ) {
    let newUrl = url
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect(newUrl)
    }
    next()
  }
}
