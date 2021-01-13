"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdProviderOnApplication = void 0;
const nexus_1 = require("nexus");
exports.IdProviderOnApplication = nexus_1.objectType({
    name: 'IdProviderOnApplication',
    definition(t) {
        t.model.Application();
        t.model.IdentityProvider();
        t.model.isEnabled();
        t.model.isOverwritten();
        t.model.data();
        t.model.providerType();
        t.model.createdAt();
        t.model.updatedAt();
    }
});
