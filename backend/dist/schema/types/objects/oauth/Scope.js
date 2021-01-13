"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scope = void 0;
const nexus_1 = require("nexus");
exports.Scope = nexus_1.objectType({
    name: 'Scope',
    definition(t) {
        t.model.name();
        t.model.description();
    },
});
