"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavascriptOrigin = void 0;
const nexus_1 = require("nexus");
exports.JavascriptOrigin = nexus_1.objectType({
    name: 'JavascriptOrigin',
    definition(t) {
        t.model.uri();
        t.model.createdAt();
    },
});
