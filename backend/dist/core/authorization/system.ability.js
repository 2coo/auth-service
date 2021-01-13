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
exports.getRulesForUser = exports.defineSystemAbilitiesFor = void 0;
const jwksClient = require("jwks-rsa");
const lodash_1 = require("lodash");
const utils_1 = require("../../api/controllers/utils");
const interpolate_1 = require("../helpers/interpolate");
const index_1 = require("./../../api/client/index");
const casl_helpers_1 = require("./common/casl-helpers");
function defineSystemAbilitiesFor(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const permissions = yield exports.getRulesForUser(req);
        return casl_helpers_1.createAbility(permissions);
    });
}
exports.defineSystemAbilitiesFor = defineSystemAbilitiesFor;
exports.getRulesForUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.protocol + '://' + req.get('host');
    const jwks_client = jwksClient({
        cache: true,
        rateLimit: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10000,
        jwksUri: `${host}/.well-known/jwks.json`,
    });
    let accessToken = req.cookies.access_token;
    if (!accessToken && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
            const scheme = parts[0];
            const credentials = parts[1];
            if (/^Bearer$/i.test(scheme)) {
                accessToken = credentials;
            }
        }
    }
    if (!accessToken) {
        return [];
    }
    const payload = yield index_1.verifyJWT(jwks_client, accessToken);
    console.log(payload);
    const user = yield utils_1.getUserById(payload.sub);
    if (!user) {
        return [];
    }
    const roles = utils_1.getUserRoles(user);
    const permissions = lodash_1.uniqWith(roles
        .filter((role) => role.permissions !== null)
        .map((role) => interpolate_1.default(role.permissions, { user }))
        .flat(), lodash_1.isEqual).map((rule) => rule);
    return permissions;
});
