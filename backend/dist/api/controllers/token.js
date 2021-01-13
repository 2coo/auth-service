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
exports.jwks = exports.revoke = void 0;
const passport = require("passport");
const context_1 = require("../../context");
const fs = require("fs");
const jose = require("node-jose");
exports.revoke = [
    passport.authenticate(['basic', 'clientPassword'], {
        session: false,
        passReqToCallback: true,
    }),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield context_1.prisma.refreshToken.delete({
                where: {
                    refreshToken: req.body.refresh_token,
                },
            });
            return res.json({
                success: true,
                message: 'Successfully revoked.',
            });
        }
        catch (err) {
            return res.status(500).json({
                message: err,
            });
        }
    }),
];
exports.jwks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ks = fs.readFileSync(`${__dirname}/../../keys/jwks.json`);
    const keyStore = yield jose.JWK.asKeyStore(ks.toString());
    res.json(keyStore.toJSON());
});
