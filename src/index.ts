import { config } from 'dotenv-flow'
config()
import { GraphQLServer } from 'graphql-yoga'
import { createContext } from './context'
import { permissions } from './permissions'
import { schema } from './schema'
import { formatError } from 'apollo-errors'

const graphqlServer = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
})

graphqlServer.start(
  {
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: process.env.NODE_ENV === 'development' ? '/playground' : false,
    debug: process.env.NODE_ENV === 'development',
    formatError,
    port: 4040,
  },
  ({ port, endpoint, subscriptions, playground }) =>
    console.log(
      `🚀 Server ready at: http://localhost:${port}${endpoint}, http://localhost:${port}${subscriptions}. ⭐️${
        playground
          ? `\n🚀 Playground ready at: http://localhost:${port}${playground} ⭐️`
          : ''
      }`,
    ),
)
require('./api/')(graphqlServer.express)
