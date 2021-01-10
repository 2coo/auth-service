import Mail from '../lib/Mail'
import mailConfig from '../config/mail'
import systemConfig from '../config/system'

export const ResetPasswordMail = {
  key: 'ResetPasswordMail',
  async handle({ data }: any) {
    const { email, token }: { email: string; token: string } = data
    await Mail.sendMail({
      from: mailConfig.from,
      to: email,
      subject:
        '[Important Action Required] Reset your TOMUJIN DIGITAL password',
      html: `<p>It's okay! This happens to the best of us.</p>
      <a href="http://${systemConfig.domain}/login/reset?token=${token}">Reset Password</a>
      `,
    })
  },
}
