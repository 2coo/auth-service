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
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const cryptoRandomString = require("crypto-random-string");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const passport = require("passport");
const passport_http_1 = require("passport-http");
const passport_local_1 = require("passport-local");
const passport_oauth2_client_password_1 = require("passport-oauth2-client-password");
const passport_remember_me_extended_1 = require("passport-remember-me-extended");
const client_2 = require("../client");
const user_1 = require("../client/user");
const passport_custom_1 = require("passport-custom");
const utils_1 = require("./../controllers/utils");
const system_1 = require("../../config/system");
passport.use(new passport_local_1.Strategy({ usernameField: 'username', passReqToCallback: true }, (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = String(req.query.client_id);
    utils_1.getUserByUsernameOrEmail(username)
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user ||
            (user && user.accountStatusType === client_1.AccountStatusType.DISABLED)) {
            return done(new Error('The user does not exists!'));
        }
        const registration = yield utils_1.getUserRegistration(user.id, clientId);
        if (!registration)
            return done(new Error("You don't have registration for this app!"));
        const passwordValid = yield bcryptjs_1.compare(password, user.password);
        if (!passwordValid) {
            return done(new Error('Invalid username or password!'));
        }
        return done(null, user);
    }))
        .catch((error) => {
        console.log(error);
        done(new Error(error));
    });
})));
passport.use(new passport_remember_me_extended_1.Strategy((token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield utils_1.consumeRememberMeToken(token);
        if (!user) {
            return done(new Error('The user does not exists!'));
        }
        return done(null, user);
    }
    catch (err) {
        return done(new Error(err));
    }
}), (user, done) => __awaiter(void 0, void 0, void 0, function* () {
    const token = cryptoRandomString({ length: 64, type: 'url-safe' });
    try {
        const savedToken = yield utils_1.saveRememberMeToken(token, user.id);
        if (savedToken)
            return done(null, token);
    }
    catch (err) {
        return done(new Error(err));
    }
})));
passport.use('jwt', new client_2.JWTScopeStrategy((req, done) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultApp = req.session.defaultApp;
    const host = req.protocol + '://' + req.get('host');
    const client = jwksClient({
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
    if (!accessToken)
        return done(new Error('The token is empty!'));
    try {
        const kid = client_2.getKIDfromAccessToken(accessToken);
        const key = yield client.getSigningKeyAsync(kid);
        const payload = jwt.verify(accessToken, key.getPublicKey(), {
            algorithms: ['RS256'],
            issuer: system_1.default.jwt_default_issuer,
        });
        if (payload.token_use === 'access')
            req.session.client_id = payload.client_id;
        const appUser = new user_1.AppUser(payload);
        if (appUser.canScope(req.scope))
            return done(new Error(`Not allowed scope`));
        const user = yield utils_1.getUserById(String(appUser.payload.sub));
        if (!user)
            return done(new Error('User not found!'));
        return done(null, user);
    }
    catch (err) {
        console.log('\t', err);
        if (err)
            done(new Error(err));
    }
})));
passport.serializeUser((user, done) => {
    return done(null, user.id);
});
passport.deserializeUser((id, done) => {
    utils_1.getUserById(id)
        .then((user) => {
        if (!user ||
            (user && user.accountStatusType === client_1.AccountStatusType.DISABLED)) {
            return done(new Error('The user does not exists!'));
        }
        return done(null, user);
    })
        .catch((error) => done(new Error(error)));
});
function verifyClient(clientId, clientSecret, done) {
    utils_1.getClientById(clientId, {
        EnabledScopes: true,
        RedirectUris: true,
        SelfRegistrationFields: true,
    })
        .then((client) => {
        if (!client)
            return done(null, false, {
                error: {
                    status: 403,
                    message: 'Unauthorized Client!',
                },
            });
        if (client.secret === clientSecret)
            return done(null, client);
        return done(null, client);
    })
        .catch((error) => done(new Error(error)));
}
passport.use(new passport_http_1.BasicStrategy(verifyClient));
passport.use('clientPassword', new passport_oauth2_client_password_1.Strategy(verifyClient));
passport.use('dynamicOAuth2Client', new passport_custom_1.Strategy((req, done) => { }));
