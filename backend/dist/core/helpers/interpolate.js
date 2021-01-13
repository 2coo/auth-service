"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
exports.default = (template, vars) => {
    return JSON.parse(JSON.stringify(template), (_, rawValue) => {
        if (rawValue[0] !== '$') {
            return rawValue;
        }
        const name = rawValue.slice(2, -1);
        const value = lodash_1.get(vars, name);
        if (typeof value === 'undefined') {
            throw new ReferenceError(`Variable ${name} is not defined`);
        }
        return value;
    });
};
