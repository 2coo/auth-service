"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordReset = void 0;
const nexus_1 = require("nexus");
exports.PasswordReset = nexus_1.objectType({
    name: 'PasswordReset',
    definition(t) {
        t.model.User();
    },
});
