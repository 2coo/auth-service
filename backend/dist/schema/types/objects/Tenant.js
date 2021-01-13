"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = void 0;
const nexus_1 = require("nexus");
exports.Tenant = nexus_1.objectType({
    name: 'Tenant',
    definition(t) {
        t.model.id();
        t.model.domainName();
        t.model.isAcitve();
        t.model.Applications();
        t.model.MailSetting();
        t.model.Groups();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
