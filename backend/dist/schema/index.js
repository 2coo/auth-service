"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const nexus_1 = require("nexus");
const nexus_plugin_prisma_1 = require("nexus-plugin-prisma");
const types = require("./types");
const path = require("path");
exports.schema = nexus_1.makeSchema({
    shouldExitAfterGenerateArtifacts: process.env.NEXUS_SHOULD_EXIT_AFTER_GENERATE_ARTIFACTS === 'true',
    types,
    plugins: [
        nexus_plugin_prisma_1.nexusPrisma({
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
        typegen: path.join(__dirname, '../../node_modules/@types/nexus-typegen/index.d.ts'),
        schema: path.join(__dirname, '../../api.graphql'),
    },
});
