"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessToken = void 0;
const nexus_1 = require("nexus");
exports.AccessToken = nexus_1.objectType({
    name: 'AccessToken',
    definition(t) {
        t.model.expirationDate();
        t.model.User();
        t.model.Application();
        t.model.createdAt();
    },
});
