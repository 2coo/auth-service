import { enumType } from 'nexus'

export const SMTPSecurity = enumType({
  name: 'SMTPSecurity',
  members: ['NONE', 'TLS', 'SSL'],
  description: 'Security options of SMTP server',
})
