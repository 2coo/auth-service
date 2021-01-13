"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = void 0;
const nexus_1 = require("nexus");
exports.Gender = nexus_1.enumType({
    name: 'Gender',
    members: ['MALE', 'FEMALE', 'OTHER'],
    description: 'Gender of users',
});
