import * as fs from 'fs'
import * as jose from 'node-jose'
import * as _ from 'lodash'

const generateKeys = async (numberOfKeys: number = 2) => {
  const keystore = jose.JWK.createKeyStore()
  for (const keyIndex of _.range(0, numberOfKeys)) {
    console.log(`Key-${keyIndex} generated successfully.`)
    await keystore.generate('RSA', 2048, {
      alg: 'RS256',
      use: 'sig',
    })
  }
  fs.writeFileSync(
    `${__dirname}/jwks.json`,
    JSON.stringify(keystore.toJSON(true), null, '  '),
  )
}

export default generateKeys

if (require.main === module) {
  generateKeys()
}
