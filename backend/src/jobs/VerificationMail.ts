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
      to: `User <${user.email}>`,
      subject: 'Email Verification',
      html: `<p>Hi, ${user.email}</p>
      <p>Verification code is <code>${code}</code>.</p>
      `,
    })
  },
}
