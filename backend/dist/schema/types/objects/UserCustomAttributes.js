"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCustomAttribute = void 0;
const nexus_1 = require("nexus");
exports.UserCustomAttribute = nexus_1.objectType({
    name: 'UserCustomAttribute',
    definition(t) {
        t.model.Profile();
        t.model.name();
        t.model.value();
    },
});
