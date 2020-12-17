import { join } from 'path'
import { makeSchema } from 'nexus'
import { nexusPrisma } from 'nexus-plugin-prisma'
import * as types from './types'
import path from 'path'

export const schema = makeSchema({
  shouldExitAfterGenerateArtifacts:
    process.env.NEXUS_SHOULD_EXIT_AFTER_GENERATE_ARTIFACTS === 'true',
  types,
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
    }),
  ],
  contextType: {
    module: require.resolve('.prisma/client/index.d.ts'),
    export: 'PrismaClient',
  },
  sourceTypes: {
    modules: [
      {
        module: require.resolve('.prisma/client/index.d.ts'),
        alias: 'PrismaClient',
      },
    ],
  },
  outputs: {
    typegen: path.join(
      __dirname,
      '../../node_modules/@types/nexus-typegen/index.d.ts',
    ),
    schema: path.join(__dirname, '../../api.graphql'),
  },
})
