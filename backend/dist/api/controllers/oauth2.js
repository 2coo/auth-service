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
exports.providers = exports.idpresponse = exports.token = exports.decision = exports.dialog = exports.authorization = exports.trustedAppHandler = void 0;
const bcryptjs_1 = require("bcryptjs");
const connect_ensure_login_1 = require("connect-ensure-login");
const _ = require("lodash");
const moment = require("moment-timezone");
const oauth2orize = require("oauth2orize");
const passport = require("passport");
const queryString = require("query-string");
const redisclient_1 = require("../../redisclient");
const client_1 = require("../client");
const utils_1 = require("./utils");
const createError = require("http-errors");
// Create OAuth 2.0 server
const server = oauth2orize.createServer({
    store: redisclient_1.store,
    loadTransaction: true,
});
server.serializeClient((client, done) => done(null, client.id));
server.deserializeClient((id, done) => {
    utils_1.getClientById(id, {
        EnabledScopes: true,
        RedirectUris: true,
        SelfRegistrationFields: true,
    })
        .then((client) => {
        return done(null, client);
    })
        .catch((error) => {
        return done(error);
    });
});
const issueTokens = (userId, clientId, scope, done, onlyAccessToken = false) => {
    return utils_1.getClient(clientId)
        .then((client) => {
        if (!client)
            throw new Error('The client not found!');
        utils_1.issueAccessToken(clientId, userId, scope, client.accessTokenLifetime).then((accessToken) => __awaiter(void 0, void 0, void 0, function* () {
            let refreshToken = null;
            if (userId && !onlyAccessToken) {
                refreshToken = (yield utils_1.issueRefreshToken(clientId, userId, scope, client.refreshTokenLifetime)).refreshToken;
            }
            let idToken = null;
            if (scope.indexOf('openid') > -1 && userId) {
                idToken = yield utils_1.issueIdToken(clientId, userId, scope, client.idTokenLifetime);
            }
            return done(null, accessToken, refreshToken, Object.assign({ expiresIn: client.accessTokenLifetime * 60 }, (idToken && {
                id_token: idToken,
            })));
        }));
    })
        .catch((error) => {
        return done(new Error(error));
    });
};
server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
    utils_1.generateAuthCode(client.id, user.id, redirectUri, ares.scope)
        .then((authCode) => {
        return done(null, authCode.code);
    })
        .catch((error) => {
        return done(error);
    });
}));
server.grant(oauth2orize.grant.token((client, user, ares, done) => {
    issueTokens(user.id, client.id, ares.scope, done);
}));
server.exchange(oauth2orize.exchange.code((client, code, redirectUri, done) => {
    utils_1.getAuthCode(code)
        .then((authCode) => __awaiter(void 0, void 0, void 0, function* () {
        if (!authCode)
            return done(null, false);
        if (redirectUri !== authCode.redirectURI)
            return done(null, false);
        if (!moment().isBefore(moment.parseZone(authCode.expirationDate)))
            return done(null, false);
        yield utils_1.deleteAuthCode(authCode.id);
        const scopes = authCode.Scopes.map((scope) => scope.name);
        issueTokens(authCode.userId, client.id, scopes, done);
    }))
        .catch((error) => {
        return done(error);
    });
}));
server.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
    // Validate the client
    utils_1.getClientById(client.id)
        .then((localClient) => {
        if (!localClient)
            return done(null, false);
        if (localClient.secret !== client.secret)
            return done(null, false);
        // validate the user
        utils_1.getUserByUsernameOrEmail(username).then((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (!user)
                return done(null, false);
            const passwordValid = yield bcryptjs_1.compare(password, user.password);
            if (!passwordValid)
                return done(null, false);
            // Everything validated, return the token
            issueTokens(user.id, client.id, scope, done);
        }));
    })
        .catch((error) => {
        return done(error);
    });
}));
server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
    // Validate the client
    utils_1.getClientById(client.id)
        .then((localClient) => {
        if (!localClient)
            return done(null, false);
        if (localClient.secret !== client.secret)
            return done(null, false);
        // Everything validated, return the token
        // Pass in a null for user id since there is no user with this grant type
        issueTokens(null, client.clientId, scope, done, true);
    })
        .catch((error) => {
        return done(error);
    });
}));
server.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
    utils_1.getRefreshToken(refreshToken)
        .then((refreshToken) => {
        if (!refreshToken)
            return done(null, false);
        if (utils_1.isExpired(refreshToken.expirationDate))
            return done(null, false);
        issueTokens(refreshToken.userId, client.id, refreshToken.Scopes.map((scope) => scope.name), done, true);
    })
        .catch((err) => done(null, false));
}));
exports.trustedAppHandler = server.authorization((clientId, redirectUri, done) => {
    utils_1.getClientById(clientId, {
        EnabledScopes: true,
        RedirectUris: true,
        SelfRegistrationFields: true,
    })
        .then((client) => {
        if (!client)
            return done(null, false);
        if (_.some(client.RedirectUris, {
            url: redirectUri,
        })) {
            return done(null, client, redirectUri);
        }
        return done(new Error('Redirect uri does not match the registered Redirect Uri for this app.'));
    })
        .catch((error) => {
        return done(error);
    });
}, (client, user, done) => {
    // Check if grant request qualifies for immediate approval
    // Auto-approve
    if (client != null &&
        client.trustedApplication &&
        client.trustedApplication === true) {
        return done(null, true, {
            scope: client.EnabledScopes.map((scope) => scope.name),
        });
    }
    return done(null, false);
});
// User authorization endpoint.
exports.authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.isAuthenticated()) {
        return client_1.renderSPA(req, res, next);
    }
    let application = yield utils_1.getClientById(req.session.defaultApp.id, {
        EnabledScopes: true,
    });
    if (req.query.client_id) {
        application = yield utils_1.getClientById(req.query.client_id, {
            EnabledScopes: true,
        });
    }
    console.log(application);
    req.query = Object.assign(Object.assign({}, queryString.parse(client_1.defaultLinkBuilder(application, ''))), req.query);
    const queries = queryString.stringify(req.query);
    if (!application)
        return res.status(403).json({
            success: false,
            message: 'The application does not exists!',
        });
    if (application === null || application === void 0 ? void 0 : application.trustedApplication) {
        return exports.trustedAppHandler(req, res, next);
    }
    const registration = yield utils_1.getUserRegistration(req.user.id, req.query.client_id);
    if (!registration)
        return next(new Error("You don't have registration for this app!"));
    return res.redirect(`/oauth2/authorize/dialog?${queries}`);
});
exports.dialog = [
    server.authorization((clientId, redirectUri, done) => {
        utils_1.getClientById(clientId, {
            EnabledScopes: true,
            RedirectUris: true,
            SelfRegistrationFields: true,
        })
            .then((client) => {
            if (!client)
                return done(null, false);
            if (_.some(client.RedirectUris, {
                url: redirectUri,
            })) {
                return done(null, client, redirectUri);
            }
            return done(createError(403, 'Redirect uri does not match the registered Redirect Uri for this app.'));
        })
            .catch((error) => {
            return done(error);
        });
    }, (client, user, done) => {
        // Check if grant request qualifies for immediate approval
        // Auto-approve
        if (client != null &&
            client.trustedApplication &&
            client.trustedApplication === true) {
            return done(null, true);
        }
        return done(null, false);
    }),
    (request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const client = request
            .oauth2.client;
        const clientScopes = utils_1.getScopesFromClient(client);
        const scopes = request.query.scope
            ? request.query.scope.split(' ')
            : [];
        const invalidScopes = _.difference(scopes, clientScopes);
        if (invalidScopes.length > 0) {
            return response.status(500).json({
                message: `Invalid scopes: [${invalidScopes.join(', ')}]`,
            });
        }
        response.json({
            transaction_id: request.oauth2.transactionID,
            email: request.user.email,
            application: request.oauth2.client.name,
            scopes: request
                .oauth2.client.EnabledScopes.filter((scope) => scopes.indexOf(scope.name) > -1)
                .map((scope) => ({
                name: scope.name,
                description: scope.description,
            })),
        });
    }),
];
// User decision endpoint.
exports.decision = [
    connect_ensure_login_1.ensureLoggedIn(),
    (req, res, next) => {
        console.log(req.body);
        next();
    },
    server.decision((req, done) => {
        var _a;
        // remove all client does not have
        const requestedScopes = (_a = req.oauth2) === null || _a === void 0 ? void 0 : _a.req.scope;
        const client = req.oauth2.client;
        const clientScopes = utils_1.getScopesFromClient(client);
        return done(null, {
            scope: _.filter(requestedScopes, (scope) => clientScopes.indexOf(scope) > -1),
        });
    }),
];
exports.token = [
    passport.authenticate(['basic', 'clientPassword'], {
        session: false,
        passReqToCallback: true,
    }),
    server.token({
        session: false,
        passReqToCallback: true,
    }),
    server.errorHandler(),
];
exports.idpresponse = (req, res, next) => {
    //todo
};
exports.providers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queryParams = req.query;
    if (!queryParams.client_id) {
        queryParams.client_id = req.session.defaultApp.id;
    }
    const application = utils_1.getClientById(queryParams.client_id);
    const providers = (_a = (yield application.IdentityProviders({
        include: {
            IdentityProvider: true,
        },
    }))) === null || _a === void 0 ? void 0 : _a.map((provider) => provider.providerType);
    return res.json({
        success: true,
        data: providers !== null && providers !== void 0 ? providers : [],
    });
});
