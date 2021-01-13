"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const nexus_1 = require("nexus");
exports.RefreshToken = nexus_1.objectType({
    name: 'RefreshToken',
    definition(t) {
        t.model.refreshToken();
        t.model.expirationDate();
        t.model.createdAt();
    },
});
