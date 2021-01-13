"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const jose = require("node-jose");
const _ = require("lodash");
const generateKeys = (numberOfKeys = 2) => __awaiter(void 0, void 0, void 0, function* () {
    const keystore = jose.JWK.createKeyStore();
    for (const keyIndex of _.range(0, numberOfKeys)) {
        console.log(`Key-${keyIndex} generated successfully.`);
        yield keystore.generate('RSA', 2048, {
            alg: 'RS256',
            use: 'sig',
        });
    }
    fs.writeFileSync(`${__dirname}/jwks.json`, JSON.stringify(keystore.toJSON(true), null, '  '));
});
exports.default = generateKeys;
if (require.main === module) {
    generateKeys();
}
