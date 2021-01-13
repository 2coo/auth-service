"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDevice = void 0;
const nexus_1 = require("nexus");
exports.UserDevice = nexus_1.objectType({
    name: 'UserDevice',
    definition(t) {
        t.model.User();
    },
});
