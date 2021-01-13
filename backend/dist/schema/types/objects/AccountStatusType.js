"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatusType = void 0;
const nexus_1 = require("nexus");
exports.AccountStatusType = nexus_1.enumType({
    name: 'AccountStatusType',
    members: [
        'UNCONFIRMED',
        'CONFIRMED',
        'ARCHIVED',
        'COMPROMISED',
        'UNKNOWN',
        'RESET_REQUIRED',
        'FORCE_CHANGE_PASSWORD',
        'DISABLED',
    ],
    description: 'Account status of users',
});
