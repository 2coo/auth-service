"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationCode = void 0;
const nexus_1 = require("nexus");
exports.AuthorizationCode = nexus_1.objectType({
    name: 'AuthorizationCode',
    definition(t) {
        t.model.code();
        t.model.redirectURI();
        t.model.expirationDate();
        t.model.Scopes();
        t.model.User();
        t.model.Application();
        t.model.createdAt();
    },
});
