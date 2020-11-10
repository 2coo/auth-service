import { validateTokenExpiration } from './../validate'
import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { prisma } from '../../context'

export const info = async (req: Request, res: Response, next: Function) => {
  try {
    const accessToken = validateTokenExpiration(req.params!.access_token)
  } catch (err) {
    res.status(400).json({
      error: err,
    })
  }
}

export const revoke = (req: Request, res: Response, next: Function) => {}
