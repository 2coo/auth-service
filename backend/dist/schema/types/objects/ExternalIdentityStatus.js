"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalIdentityStatus = void 0;
const nexus_1 = require("nexus");
exports.ExternalIdentityStatus = nexus_1.enumType({
    name: 'ExternalIdentityStatus',
    members: ['UNCONFIRMED', "CONFIRMED", 'DISABLED'],
    description: 'Status of external identity',
});
