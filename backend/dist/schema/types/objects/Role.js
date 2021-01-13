"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const nexus_1 = require("nexus");
exports.Role = nexus_1.objectType({
    name: 'Role',
    definition(t) {
        t.model.name();
        t.model.permissions();
        t.model.Registrations();
        t.model.Groups();
        t.model.ParentRoles();
        t.model.ChildRoles();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
