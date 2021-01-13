"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalIdentifier = void 0;
const nexus_1 = require("nexus");
exports.ExternalIdentifier = nexus_1.objectType({
    name: 'ExternalIdentifier',
    definition(t) {
        t.model.Tenant();
        t.model.Application();
        t.model.IdentityProvider();
        t.model.status();
        t.model.data();
        t.model.providerType();
        t.model.isUserCreatedBefore();
        t.model.User();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
