"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedProvider = void 0;
const nexus_1 = require("nexus");
exports.SupportedProvider = nexus_1.enumType({
    name: 'SupportedProvider',
    members: ['GOOGLE', 'FACEBOOK', 'APPLE'],
    description: 'Supported providers',
});
