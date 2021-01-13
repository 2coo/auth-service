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
exports.verifyTokenAndUpdatePassword = exports.generateResetPasswordToken = exports.verifyCode = exports.generateVerificationCode = exports.registerUser = exports.saveRememberMeToken = exports.consumeRememberMeToken = exports.getUserRolesGroupedByApplication = exports.getUserApplicationRoles = exports.getUserRoles = exports.getDefaultApplicationByTenant = exports.getRefreshToken = exports.getScopesFromClient = exports.getRolesFromUser = exports.deleteAuthCode = exports.getUserRegistration = exports.getUserByUsernameOrEmail = exports.getAccessToken = exports.getClientById = exports.isExpired = exports.calculateExpirationDate = exports.calculateExpiresInAsSecond = exports.issueRefreshToken = exports.issueIdToken = exports.issueAccessToken = exports.getAuthCode = exports.generateAuthCode = exports.getUserById = exports.getClient = exports.mapScopes = void 0;
const client_1 = require("@prisma/client");
const fs = require("fs");
const lodash_1 = require("lodash");
const moment = require("moment");
const node_jose_1 = require("node-jose");
const uuid_1 = require("uuid");
const bcrypt = require("bcryptjs");
const context_1 = require("../../context");
const crypto_1 = require("crypto");
const signToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const ks = fs.readFileSync(`${__dirname}/../../keys/jwks.json`);
    const keyStore = yield node_jose_1.JWK.asKeyStore(ks.toString());
    const jwks = keyStore.all({ use: 'sig' });
    const rawKey = lodash_1.sample(jwks);
    if (rawKey !== undefined) {
        const key = yield node_jose_1.JWK.asKey(rawKey);
        const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } };
        const token = yield node_jose_1.JWS.createSign(opt, key)
            .update(JSON.stringify(payload))
            .final();
        return token;
    }
    throw new Error('RawKey is undefined!');
});
exports.mapScopes = (scopes) => {
    return scopes.map((scope) => ({
        name: scope,
    }));
};
exports.getClient = (clientId) => {
    return context_1.prisma.application.findUnique({
        where: {
            id: clientId,
        },
        include: {
            EnabledScopes: true,
        },
    });
};
exports.getUserById = (userId) => {
    return context_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            Groups: {
                include: {
                    Roles: {
                        include: {
                            Application: true,
                        },
                    },
                },
            },
            Registrations: {
                include: {
                    Application: true,
                    Roles: true,
                },
            },
            Profile: true,
        },
    });
};
exports.generateAuthCode = (clientId, userId, redirectUri, scopes) => {
    return context_1.prisma.authorizationCode.create({
        data: {
            Application: {
                connect: {
                    id: clientId,
                },
            },
            expirationDate: moment()
                .add({
                minute: 1,
            })
                .toISOString(),
            redirectURI: redirectUri,
            User: {
                connect: {
                    id: userId,
                },
            },
            Scopes: {
                connect: exports.mapScopes(scopes),
            },
        },
    });
};
exports.getAuthCode = (code) => {
    return context_1.prisma.authorizationCode.findUnique({
        where: {
            code: code,
        },
        include: {
            Scopes: true,
        },
    });
};
exports.issueAccessToken = (clientId, userId, scopes, accessTokenLifetime) => __awaiter(void 0, void 0, void 0, function* () {
    const expirationDate = exports.calculateExpirationDate(accessTokenLifetime);
    const jti = uuid_1.v4();
    const application = yield exports.getClientById(clientId, {
        EnabledScopes: true,
        RedirectUris: true,
        SelfRegistrationFields: true,
    });
    if (userId) {
        const user = yield exports.getUserById(userId);
        if (user) {
            const token = yield signToken({
                iss: application.issuer,
                sub: userId,
                aud: clientId,
                client_id: clientId,
                groups: user.Groups.map((group) => group.name),
                roles: exports.getUserApplicationRoles(user, clientId).map((role) => role.name),
                scopes: scopes,
                token_use: 'access',
                // nbf: NaN,
                iat: moment().valueOf() / 1000,
                exp: expirationDate.valueOf() / 1000,
                jti: jti,
                // claims
                preferred_username: user.username,
            });
            yield context_1.prisma.accessToken.create({
                data: {
                    jti: jti,
                    Application: {
                        connect: {
                            id: clientId,
                        },
                    },
                    User: {
                        connect: {
                            id: userId,
                        },
                    },
                    Scopes: {
                        connect: exports.mapScopes(scopes),
                    },
                    expirationDate: expirationDate.toISOString(),
                },
            });
            return token;
        }
    }
    else {
        const token = yield signToken({
            iss: application.issuer,
            sub: clientId,
            aud: clientId,
            client_id: clientId,
            token_use: 'access',
            iat: moment().valueOf(),
            exp: expirationDate.valueOf() / 1000,
            jti: jti,
            scopes: application.EnabledScopes.map((scope) => scope.name),
            roles: [],
            groups: [],
            preferred_username: application.name,
        });
        yield context_1.prisma.accessToken.create({
            data: {
                jti: jti,
                Application: {
                    connect: {
                        id: clientId,
                    },
                },
                Scopes: {
                    connect: exports.mapScopes(scopes),
                },
                expirationDate: expirationDate.toISOString(),
            },
        });
        return token;
    }
    throw Error('User not found!');
});
exports.issueIdToken = (clientId, userId, scopes, idTokenLifetime) => __awaiter(void 0, void 0, void 0, function* () {
    const expirationDate = exports.calculateExpirationDate(idTokenLifetime);
    const jti = uuid_1.v4();
    const application = yield exports.getClientById(clientId);
    const user = yield exports.getUserById(userId);
    if (user) {
        const token = yield signToken(Object.assign(Object.assign({ iss: application.issuer, sub: userId, aud: clientId, token_use: 'id', 
            // nbf: NaN,
            iat: moment().valueOf() / 1000, exp: expirationDate.valueOf() / 1000, jti: jti }, (scopes.indexOf('email') > -1 && {
            email: user.email,
            email_verified: user.accountStatusType === client_1.AccountStatusType.CONFIRMED,
        })), (scopes.indexOf('profile') > -1 && Object.assign({}, (user.Profile && {
            gender: user.Profile.gender,
            birthdate: moment.parseZone(user.Profile.birthdate).format(),
            family_name: user.Profile.lastName,
            given_name: user.Profile.firstName,
            picture: user.Profile.picture,
            preferred_username: user.username,
            groups: user.Groups.map((group) => group.name),
        })))));
        return token;
    }
    throw Error('User not found!');
});
exports.issueRefreshToken = (clientId, userId, scopes, refreshTokenLifetime) => {
    return context_1.prisma.refreshToken.create({
        data: {
            Application: {
                connect: {
                    id: clientId,
                },
            },
            User: {
                connect: {
                    id: userId,
                },
            },
            Scopes: {
                connect: exports.mapScopes(scopes),
            },
            expirationDate: moment()
                .add({
                minute: refreshTokenLifetime,
            })
                .toISOString(),
        },
    });
};
exports.calculateExpiresInAsSecond = (expirationDate) => {
    return moment.parseZone(expirationDate).diff(moment(), 'seconds');
};
exports.calculateExpirationDate = (accessTokenLifetime) => {
    return moment().add({
        minute: accessTokenLifetime,
    });
};
exports.isExpired = (expirationDate) => {
    return moment().isAfter(moment(expirationDate));
};
exports.getClientById = (clientId, include) => {
    return context_1.prisma.application.findUnique(Object.assign({ where: {
            id: clientId,
        } }, (include !== undefined
        ? {
            include,
        }
        : {})));
};
exports.getAccessToken = (jti) => {
    return context_1.prisma.accessToken.findUnique({
        where: {
            jti,
        },
        include: {
            Application: true,
            Scopes: true,
        },
    });
};
exports.getUserByUsernameOrEmail = (username) => {
    return context_1.prisma.user.findFirst({
        where: {
            OR: [
                {
                    username: username,
                },
                {
                    email: username,
                },
            ],
        },
        include: {
            Profile: true,
            Groups: {
                include: {
                    Roles: true,
                },
            },
        },
    });
};
exports.getUserRegistration = (userId, appId) => {
    return context_1.prisma.registration.findUnique({
        where: {
            userId_applicationId: {
                userId: userId,
                applicationId: appId,
            },
        },
    });
};
exports.deleteAuthCode = (id) => {
    return context_1.prisma.authorizationCode.delete({
        where: {
            id,
        },
    });
};
exports.getRolesFromUser = (user) => {
    return lodash_1.uniq(lodash_1.flatMap(user.Groups, (group) => group.Roles.map((role) => (Object.assign({}, role)))));
};
exports.getScopesFromClient = (client) => {
    return client.EnabledScopes.map((scope) => scope.name);
};
exports.getRefreshToken = (refreshToken) => {
    return context_1.prisma.refreshToken.findUnique({
        where: {
            refreshToken,
        },
        include: {
            Scopes: true,
        },
    });
};
exports.getDefaultApplicationByTenant = (id) => {
    const defaultApp = context_1.prisma.application.findUnique({
        where: {
            tenantId_name: {
                name: 'Default',
                tenantId: id,
            },
        },
        include: {
            EnabledScopes: true,
            RedirectUris: true,
        },
    });
    return defaultApp;
};
exports.getUserRoles = (user) => {
    const groupRoles = user.Groups.map((group) => group.Roles).flat();
    const registrationRoles = user.Registrations.map((registration) => registration.Roles.map((role) => (Object.assign(Object.assign({}, role), { Application: registration.Application }))).flat()).flat();
    const userRoles = lodash_1.uniqBy([...groupRoles, ...registrationRoles], 'id');
    return userRoles;
};
exports.getUserApplicationRoles = (user, applicationId) => {
    var _a;
    /*
    Some or all of these Roles are managed by Group membership(s) to Academic head, Teacher.
    Removing assigned Roles here may not remove the Role
    from the User if the Role has been assigned by the Group membership.
    */
    const groupRoles = user.Groups.map((group) => group.Roles.filter((role) => role.applicationId === applicationId)).flat();
    const registrationRoles = ((_a = user.Registrations.find((registration) => registration.Application.id === applicationId)) === null || _a === void 0 ? void 0 : _a.Roles) || [];
    return lodash_1.uniqBy([...groupRoles, ...registrationRoles], 'applicationId');
};
exports.getUserRolesGroupedByApplication = (user) => {
    const groupRoles = user.Groups.map((group) => group.Roles).flat();
    const registrationRoles = user.Registrations.map((registration) => registration.Roles.map((role) => (Object.assign(Object.assign({}, role), { Application: registration.Application }))).flat()).flat();
    const userRoles = lodash_1.groupBy(lodash_1.uniqBy([...groupRoles, ...registrationRoles], 'id'), 'applicationId');
    return userRoles;
};
exports.consumeRememberMeToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield context_1.prisma.rememberMe.findUnique({
        where: {
            token,
        },
        include: {
            User: true,
        },
    })).User;
    if (user) {
        yield context_1.prisma.rememberMe.delete({
            where: {
                token: token,
            },
        });
    }
    return user;
});
exports.saveRememberMeToken = (token, userId) => {
    return context_1.prisma.rememberMe.create({
        data: {
            token,
            User: {
                connect: {
                    id: userId,
                },
            },
        },
    });
};
exports.registerUser = ({ data, tenantId, applications, }) => __awaiter(void 0, void 0, void 0, function* () {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(data.password, salt);
    const fullNameSplitted = data.fullname.split(' ');
    const firstName = fullNameSplitted[0];
    const lastName = fullNameSplitted[fullNameSplitted.length - 1];
    const user = yield context_1.prisma.user.create({
        data: {
            Tenant: {
                connect: {
                    id: tenantId,
                },
            },
            salt: salt,
            email: data.email,
            password: hash,
            Profile: {
                create: {
                    displayName: data.fullname,
                    firstName,
                    lastName,
                },
            },
        },
        include: {
            Profile: true,
            Groups: true,
        },
    });
    yield applications.forEach((app_id) => __awaiter(void 0, void 0, void 0, function* () {
        const defaultRole = yield context_1.prisma.role.findFirst({
            where: {
                isDefault: true,
                applicationId: app_id,
            },
        });
        yield context_1.prisma.registration.create({
            data: Object.assign({ User: {
                    connect: {
                        id: user.id,
                    },
                }, Application: {
                    connect: {
                        id: app_id,
                    },
                } }, (defaultRole
                ? {
                    Roles: {
                        connect: {
                            id: defaultRole.id,
                        },
                    },
                }
                : {})),
        });
    }));
    return user;
});
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
exports.generateVerificationCode = (length = 4, user_id) => {
    const code = lodash_1.range(length)
        .map((i) => getRandomInt(9))
        .join('');
    const expDate = exports.calculateExpirationDate(30);
    return context_1.prisma.verificationCode.create({
        data: {
            User: {
                connect: {
                    id: user_id,
                },
            },
            code: code,
            expirationDate: expDate.toISOString(),
        },
    });
};
exports.verifyCode = (code, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield context_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if ((user === null || user === void 0 ? void 0 : user.accountStatusType) === client_1.AccountStatusType.CONFIRMED)
        return true;
    const verificationCode = yield context_1.prisma.verificationCode.findFirst({
        where: {
            userId: userId,
            code: code,
            expirationDate: {
                gt: moment().toISOString(),
            },
        },
    });
    const verificationCodeExists = Boolean(verificationCode);
    let verified = false;
    if (verificationCodeExists) {
        yield context_1.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                accountStatusType: client_1.AccountStatusType.CONFIRMED,
            },
        });
        verified = true;
        yield context_1.prisma.verificationCode.delete({
            where: {
                userId_code: {
                    code,
                    userId: userId,
                },
            },
        });
    }
    return verified;
});
exports.generateResetPasswordToken = (userId, returnTo) => __awaiter(void 0, void 0, void 0, function* () {
    const token = crypto_1.randomBytes(48).toString('hex');
    const expDate = exports.calculateExpirationDate(30);
    if (!(yield context_1.prisma.passwordReset.findUnique({
        where: {
            token,
        },
    }))) {
        yield context_1.prisma.passwordReset.create({
            data: {
                token,
                User: {
                    connect: {
                        id: userId,
                    },
                },
                expirationDate: expDate.toISOString(),
                returnTo,
            },
        });
        return token;
    }
    return exports.generateResetPasswordToken(userId, returnTo);
});
exports.verifyTokenAndUpdatePassword = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = yield context_1.prisma.passwordReset.findFirst({
        where: {
            token: token,
            expirationDate: {
                gt: moment().toISOString(),
            },
        },
        include: {
            User: true,
        },
    });
    if (resetPasswordToken) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        yield context_1.prisma.user.update({
            where: {
                id: resetPasswordToken.User.id,
            },
            data: {
                password: hash,
                salt,
            },
        });
        yield context_1.prisma.passwordReset.delete({
            where: {
                token,
            },
        });
        return resetPasswordToken;
    }
    throw Error('Token is expired or revoked code!');
});
