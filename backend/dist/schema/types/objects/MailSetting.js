"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailSetting = void 0;
const nexus_1 = require("nexus");
exports.MailSetting = nexus_1.objectType({
    name: 'MailSetting',
    definition(t) {
        t.model.id();
        t.model.SMTPSecurity();
        t.model.host();
        t.model.port();
        t.model.username();
        t.model.password();
        t.model.from();
        t.model.name();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
