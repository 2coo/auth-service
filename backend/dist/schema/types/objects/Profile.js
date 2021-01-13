"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const nexus_1 = require("nexus");
exports.Profile = nexus_1.objectType({
    name: 'Profile',
    definition(t) {
        t.model.firstName();
        t.model.lastName();
        t.model.displayName();
        t.model.birthdate();
        t.model.gender();
        t.model.picture();
        t.model.User();
        t.model.mobileNumber();
        t.model.UserCustomAttributes();
        t.model.createdAt();
        t.model.updatedAt();
    },
});
