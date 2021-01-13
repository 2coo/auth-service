"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase64 = void 0;
exports.encodeBase64 = (string) => {
    return Buffer.from(string).toString('base64');
};
