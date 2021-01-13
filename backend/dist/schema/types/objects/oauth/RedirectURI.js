"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectURI = void 0;
const nexus_1 = require("nexus");
exports.RedirectURI = nexus_1.objectType({
    name: 'RedirectURI',
    definition(t) {
        t.model.url();
        t.model.createdAt();
    },
});
