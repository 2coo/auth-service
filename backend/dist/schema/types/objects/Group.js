"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const nexus_1 = require("nexus");
exports.Group = nexus_1.objectType({
    name: 'Group',
    definition(t) {
        t.model.name();
        t.model.description();
        t.model.Users();
        t.model.Roles();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
