"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registration = void 0;
const nexus_1 = require("nexus");
exports.Registration = nexus_1.objectType({
    name: 'Registration',
    definition(t) {
        t.model.User();
        t.model.Application();
        t.model.Roles();
        t.model.username();
        t.model.isVerified();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
