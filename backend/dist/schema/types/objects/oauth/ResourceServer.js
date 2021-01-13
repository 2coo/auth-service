"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceServer = void 0;
const nexus_1 = require("nexus");
exports.ResourceServer = nexus_1.objectType({
    name: 'ResourceServer',
    definition(t) {
        t.model.name();
        t.model.identifier();
        t.model.Scopes();
        t.model.createdAt();
    },
});
