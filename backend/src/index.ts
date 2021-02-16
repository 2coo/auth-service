import { config } from 'dotenv'
config()
import { ApolloServer } from 'apollo-server-express'
import { applyMiddleware } from 'graphql-middleware'
import { createContext } from './context'
import { permissions } from './permissions'
import { schema } from './schema'
import * as express from 'express'
import * as HTTP from 'http'
import * as fs from 'fs'
import * as cookieParser from 'cookie-parser'
import systemConfig from './config/system'
import generateKeys from './keys/generator'

if (!fs.existsSync(`${__dirname}/keys/jwks.json`)) {
  generateKeys()
}
const graphqlServer = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
})
const app = express().use(cookieParser(systemConfig.session_secret))
const http = HTTP.createServer(app)

graphqlServer.applyMiddleware({ app })
graphqlServer.installSubscriptionHandlers(http)

require('./api/')(app)

http.listen(systemConfig.port, '0.0.0.0', () => {
  console.log(
    `🚀 GraphQL service ready at http://0.0.0.0:${systemConfig.port}/graphql`
  )
})
