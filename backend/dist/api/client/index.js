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
exports.verifyEmailIsVerified = exports.grantTypeRefreshHandler = exports.grantTypeCodeHandler = exports.verifyJWT = exports.defaultLinkBuilder = exports.renderSPA = exports.getKIDfromAccessToken = exports.verifyCookieTokens = exports.logoutSSO = exports.clearCookieTokens = exports.verifyIdPandRedirect = exports.verifySSO = exports.verifyAppOrRedirect = exports.redirectWithApp = exports.tenantAndDefaultAppMiddleware = exports.loggerMiddleware = exports.JWTScopeStrategy = void 0;
const queryString = require("query-string");
const client_1 = require("@prisma/client");
const axios_1 = require("axios");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const passport_custom_1 = require("passport-custom");
const path = require("path");
const context_1 = require("../../context");
const utils_1 = require("../controllers/utils");
const identity_providers_1 = require("./identity-providers");
const passport = require("passport");
class JWTScopeStrategy extends passport_custom_1.Strategy {
    authenticate(req, options) {
        req.scope = options.scope;
        return super.authenticate(req, options);
    }
}
exports.JWTScopeStrategy = JWTScopeStrategy;
exports.loggerMiddleware = (req, res, next) => {
    console.log('#ON:', `[${req.method}]\t`, req.url + '\t', req.url === '/oauth2/token' ? `(GRANT_TYPE: ${req.body.grant_type})` : '');
    next();
};
exports.tenantAndDefaultAppMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantDomain = !req.vhost || !req.vhost[0] ? '*' : req.vhost[0];
    const tenant = yield context_1.prisma.tenant.findUnique({
        where: {
            domainName: tenantDomain,
        },
    });
    if (!tenant) {
        return res.send(`The "${tenantDomain}" tenant not found!`);
    }
    req.session.tenant = tenant;
    const defaultApp = yield utils_1.getDefaultApplicationByTenant(tenant.id);
    req.session.defaultApp = defaultApp;
    next();
});
exports.redirectWithApp = (app, res, route = '/oauth2/authorize') => {
    const redirectTo = exports.defaultLinkBuilder(app, route);
    return res.redirect(redirectTo);
};
exports.verifyAppOrRedirect = (req, res, next) => {
    if (!req.query.client_id) {
        const defaultApp = req.session.defaultApp;
        return exports.redirectWithApp(defaultApp, res, req.route.path);
    }
    next();
};
exports.verifySSO = (options) => {
    if (typeof options == 'string') {
        options = { redirectTo: options };
    }
    options = options || {};
    var url = options.redirectTo || '/oauth2/authorize';
    var setReturnTo = options.setReturnTo === undefined ? true : options.setReturnTo;
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            exports.clearCookieTokens(res);
            exports.logoutSSO(req, res);
            const defaultApp = req.session.defaultApp;
            if (setReturnTo && req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            return exports.redirectWithApp(defaultApp, res, url);
        }
        next();
    };
};
exports.verifyIdPandRedirect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const identity_provider = req.query.identity_provider;
    if (!identity_provider) {
        return next();
    }
    let application = utils_1.getClientById(req.session.defaultApp.id, {
        IdentityProviders: true,
    });
    if (req.query.client_id) {
        application = utils_1.getClientById(req.query.client_id, {
            IdentityProviders: true,
        });
    }
    const identityProviders = yield application.IdentityProviders();
    let authorizationURL = null;
    switch (identity_provider.toUpperCase()) {
        case 'GOOGLE':
            {
                authorizationURL = identity_providers_1.googleIdentityProvider();
            }
            break;
    }
    if (!authorizationURL) {
        return next(new Error('Identity Provider Not Found!'));
    }
    return res.redirect(authorizationURL);
});
exports.clearCookieTokens = (res) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
};
exports.logoutSSO = (req, res) => {
    req.logout();
    res.clearCookie('remember_me');
};
exports.verifyCookieTokens = passport.authenticate('jwt', {
    session: false,
    scope: ['openid', 'email', 'profile'],
});
exports.getKIDfromAccessToken = (accessToken) => {
    const tokenSections = accessToken.split('.');
    if (tokenSections.length < 2) {
        throw new Error('requested token is invalid');
    }
    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const header = JSON.parse(headerJSON);
    return header.kid;
};
exports.renderSPA = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../../build', 'index.html'));
};
exports.defaultLinkBuilder = (defaultApp, route) => {
    const scopes = defaultApp.EnabledScopes.map((scope) => scope.name).join('%20');
    const failureRedirect = `${route}?response_type=code&redirect_uri=/oauth2/authorize&client_id=${defaultApp.id}&scope=${scopes}`;
    return failureRedirect;
};
exports.verifyJWT = (client, accessToken, issuer = null, audience = null) => __awaiter(void 0, void 0, void 0, function* () {
    const kid = exports.getKIDfromAccessToken(accessToken);
    const key = yield client.getSigningKeyAsync(kid);
    let payload;
    const options = Object.assign(Object.assign({ algorithms: ['RS256'] }, (issuer && {
        issuer,
    })), (audience && {
        audience,
    }));
    payload = jwt.verify(accessToken, key.getPublicKey(), options);
    return payload;
});
exports.grantTypeCodeHandler = (returnTo = '/app/') => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultApp = req.session.defaultApp;
    const host = req.protocol + '://' + req.get('host');
    const { code } = req.query;
    if (code) {
        const basicAuth = Buffer.from(`${defaultApp.id}:${defaultApp.secret}`).toString('base64');
        const tokens = (yield axios_1.default.post(`${host}/oauth2/token`, {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: '/oauth2/authorize',
        }, {
            headers: {
                Authorization: `Basic ${basicAuth}`,
            },
        })).data;
        if (tokens.access_token) {
            res.cookie('access_token', tokens.access_token, {
                httpOnly: true,
                sameSite: true,
            });
        }
        if (tokens.refresh_token) {
            res.cookie('refresh_token', tokens.refresh_token, {
                httpOnly: true,
                sameSite: true,
            });
        }
        if (tokens.id_token) {
            res.cookie('id_token', tokens.id_token, {
                httpOnly: true,
                sameSite: true,
            });
        }
        return res.redirect(returnTo);
    }
    return next();
});
exports.grantTypeRefreshHandler = (returnTo = '/app/') => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const defaultApp = req.session.defaultApp;
    const host = req.protocol + '://' + req.get('host');
    const jwks_client = jwksClient({
        cache: true,
        rateLimit: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10000,
        jwksUri: `${host}/.well-known/jwks.json`,
    });
    const access_token = req.cookies['access_token'];
    const refresh_token = req.cookies['refresh_token'];
    const id_token = req.cookies['id_token'];
    if (access_token && refresh_token && id_token) {
        try {
            const decoded = yield exports.verifyJWT(jwks_client, req.cookies.access_token, defaultApp.id, defaultApp.issuer);
            console.log('\tJWT is currently active.');
            return res.redirect(returnTo);
        }
        catch (err) {
            try {
                const basicAuth = Buffer.from(`${defaultApp.id}:${defaultApp.secret}`).toString('base64');
                const tokens = (yield axios_1.default.post(`${host}/oauth2/token`, {
                    grant_type: 'refresh_token',
                    refresh_token: req.cookies.refresh_token,
                }, {
                    headers: {
                        Authorization: `Basic ${basicAuth}`,
                    },
                })).data;
                res.cookie('access_token', tokens.access_token, {
                    httpOnly: true,
                    sameSite: true,
                });
                return res.redirect(returnTo);
            }
            catch (err2) {
                console.log('\t', err2);
                exports.clearCookieTokens(res);
                exports.logoutSSO(req, res);
            }
        }
    }
    return next();
});
exports.verifyEmailIsVerified = (options) => {
    if (typeof options == 'string') {
        options = { redirectTo: options };
    }
    options = options || {};
    var url = options.redirectTo || '/signup/validate-email';
    var setReturnTo = options.setReturnTo === undefined ? true : options.setReturnTo;
    return (req, res, next) => {
        const queryParams = req.query;
        if (setReturnTo && req.session) {
            req.session.returnTo = req.originalUrl || req.url;
        }
        if (req.user.accountStatusType === client_1.AccountStatusType.UNCONFIRMED) {
            return res.redirect(`${url}?${queryString.stringify(queryParams)}`);
        }
        return next();
    };
};
