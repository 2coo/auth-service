import 'dotenv-flow/config'
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

if (!fs.existsSync(`${__dirname}/keys/jwks.json`)) {
  throw new Error(
    'Please generate jwks: to generate jwks run "yarn key:generate"',
  )
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

http.listen(systemConfig.port, systemConfig.host, () => {
  console.log(
    `🚀 GraphQL service ready at http://localhost:${systemConfig.port}/graphql`,
  )
})
