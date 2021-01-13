"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grant = void 0;
const nexus_1 = require("nexus");
exports.Grant = nexus_1.objectType({
    name: 'Grant',
    definition(t) {
        t.model.grantType();
        t.model.createdAt();
    },
});
