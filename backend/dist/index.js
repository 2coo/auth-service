"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-flow/config");
const apollo_server_express_1 = require("apollo-server-express");
const graphql_middleware_1 = require("graphql-middleware");
const context_1 = require("./context");
const permissions_1 = require("./permissions");
const schema_1 = require("./schema");
const express = require("express");
const HTTP = require("http");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const system_1 = require("./config/system");
if (!fs.existsSync(`${__dirname}/keys/jwks.json`)) {
    throw new Error('Please generate jwks: to generate jwks run "yarn key:generate"');
}
const graphqlServer = new apollo_server_express_1.ApolloServer({
    schema: graphql_middleware_1.applyMiddleware(schema_1.schema, permissions_1.permissions),
    context: context_1.createContext,
});
const app = express().use(cookieParser(system_1.default.session_secret));
const http = HTTP.createServer(app);
graphqlServer.applyMiddleware({ app });
graphqlServer.installSubscriptionHandlers(http);
require('./api/')(app);
http.listen(system_1.default.port, '0.0.0.0', () => {
    console.log(`🚀 GraphQL service ready at http://0.0.0.0:${system_1.default.port}/graphql`);
});
