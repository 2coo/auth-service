"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantType = void 0;
const nexus_1 = require("nexus");
exports.GrantType = nexus_1.enumType({
    name: 'GrantType',
    description: '',
    members: [
        'AUTHORIZATION_CODE',
        'PASSWORD',
        'REFRESH_TOKEN',
        'CLIENT_CREDENTIALS',
        'EXTENSION',
    ],
});
