import Mail from '../lib/Mail'
import mailConfig from '../config/mail'
import { Profile, User } from '@prisma/client'

export const VerificationMail = {
  key: 'VerificationMail',
  async handle({ data }: any) {
    const {
      user,
      code,
    }: { user: User & { Profile: Profile }; code: string } = data
    await Mail.sendMail({
      from: mailConfig.from,
      to: user.email,
      subject: `TOMUJIN DIGITAL code you requested - ${code}`,
      html: `<p>Your verification code is: ${code} - TOMUJIN DIGITAL TEAM.</p>`,
    })
  },
}
