"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const nexus_1 = require("nexus");
exports.User = nexus_1.objectType({
    name: 'User',
    definition(t) {
        t.model.id();
        t.model.Tenant();
        t.model.ExternalIdentifiers();
        t.model.Registrations();
        t.model.username();
        t.model.accountStatusType();
        t.model.email();
        t.model.Groups();
        t.model.Profile();
        t.model.Groups();
        t.model.Devices();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
