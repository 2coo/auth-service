"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityProvider = void 0;
const nexus_1 = require("nexus");
exports.IdentityProvider = nexus_1.objectType({
    name: 'IdentityProvider',
    definition(t) {
        t.model.isEnabled();
        t.model.providerType();
        t.model.data();
        t.model.ExternalIdentifiers();
        t.model.Applications();
        t.model.ExternalIdentifiers();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
