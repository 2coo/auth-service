"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = void 0;
const graphql_shield_1 = require("graphql-shield");
const is_authenticated_1 = require("./is-authenticated");
const rules_1 = require("./rules");
exports.permissions = graphql_shield_1.shield({
    Query: {
        Test: graphql_shield_1.and(is_authenticated_1.isAuthenticated, rules_1.can('read', 'Test')),
    },
    Mutation: {},
}, {
    allowExternalErrors: true,
});
