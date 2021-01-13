"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMTPSecurity = void 0;
const nexus_1 = require("nexus");
exports.SMTPSecurity = nexus_1.enumType({
    name: 'SMTPSecurity',
    members: ['NONE', 'TLS', 'SSL'],
    description: 'Security options of SMTP server',
});
