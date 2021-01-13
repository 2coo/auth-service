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
exports.reset = exports.forgot = exports.verify_code = exports.validate_email = exports.register = exports.fields = exports.logout = exports.login = void 0;
const client_1 = require("@prisma/client");
const cryptoRandomString = require("crypto-random-string");
const lodash_1 = require("lodash");
const passport = require("passport");
const queryString = require("query-string");
const urlParser = require("url");
const Queue_1 = require("../../lib/Queue");
const client_2 = require("../client");
const utils_1 = require("./utils");
exports.login = [
    passport.authenticate('local', { failWithError: true }),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.body.remember_me) {
            return res.redirect(req.originalUrl);
        }
        const token = cryptoRandomString({ length: 64, type: 'url-safe' });
        const savedToken = yield utils_1.saveRememberMeToken(token, req.user.id);
        if (savedToken)
            res.cookie('remember_me', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 604800000,
            });
        return res.redirect(req.originalUrl);
    }),
    (err, req, res, next) => {
        const parsedUrl = urlParser.parse(req.url);
        const query = req.query;
        if (err.message) {
            query['error'] = Buffer.from(err.message).toString('base64');
            parsedUrl.query = queryString.stringify(query);
            parsedUrl.search = `?${queryString.stringify(query)}`;
        }
        const redirectUrl = urlParser.format(parsedUrl);
        // Handle error
        if (req.xhr) {
            return res.json(err);
        }
        return res.redirect(redirectUrl);
    },
];
exports.logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    client_2.logoutSSO(req, res);
    client_2.clearCookieTokens(res);
    res.clearCookie('remember_me');
    const clientId = req.query.client_id;
    const logoutUrl = req.query.logout_url;
    if (logoutUrl) {
        let application = req.session.defaultApp;
        if (clientId)
            application = yield utils_1.getClientById(clientId);
        if (!application)
            return res.status(403).json({
                success: false,
                message: 'The application does not exists!',
            });
        if (lodash_1.some(application.RedirectUris, {
            url: logoutUrl,
        })) {
            return res.redirect(String(req.query.logout_url));
        }
        else {
            return res.status(403).json({
                success: false,
                message: 'The logout url not exists on the application.',
            });
        }
    }
    next();
});
exports.fields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let application = yield utils_1.getClientById(req.session.defaultApp.id, {
        EnabledScopes: true,
        RedirectUris: true,
        SelfRegistrationFields: true,
    });
    if (req.query.client_id) {
        application = yield utils_1.getClientById(req.query.client_id, {
            EnabledScopes: true,
            RedirectUris: true,
            SelfRegistrationFields: true,
        });
        if (!application)
            return res.status(403).json({
                success: false,
                message: 'The application does not exists!',
            });
    }
    if (application === null || application === void 0 ? void 0 : application.selfRegistrationEnabled) {
        return res.json({
            success: true,
            data: {
                fields: application
                    .SelfRegistrationFields.filter((field) => field.isEnabled)
                    .map((field) => ({
                    name: field.fieldName,
                    type: field.fieldType,
                    is_required: field.isRequired,
                })),
            },
        });
    }
    else {
        return res.status(403).json({
            success: false,
            message: 'The application is not enabled self-registration!',
        });
    }
});
exports.register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullname } = req.body;
    let application = (yield utils_1.getClientById(req.session.defaultApp.id, {
        Tenant: true,
    }));
    console.log(req.query.client_id);
    if (req.query.client_id) {
        application = (yield utils_1.getClientById(String(req.query.client_id), {
            Tenant: true,
        }));
    }
    if (!application) {
        return res.json({
            success: false,
            message: 'The application does not exits!',
        });
    }
    const user = yield utils_1.registerUser({
        data: {
            email,
            password,
            fullname,
        },
        applications: lodash_1.uniq([req.session.defaultApp.id, application.id]),
        tenantId: req.session.tenant.id,
    });
    req.login(user, function (err) {
        if (err) {
            return next(err);
        }
        if (req.xhr) {
            return res.json({
                success: true,
                message: 'Successfully registered.',
            });
        }
        else {
            return res.redirect(`/oauth2/authorize?${queryString.stringify(req.query)}`);
        }
    });
});
exports.validate_email = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user.accountStatusType === client_1.AccountStatusType.UNCONFIRMED) {
        const verificationCode = yield utils_1.generateVerificationCode(4, user.id);
        yield Queue_1.default.add('VerificationMail', { user, code: verificationCode.code });
    }
    return res.json({
        success: true,
        data: {
            email: user.email,
            is_verified: user.accountStatusType === client_1.AccountStatusType.CONFIRMED,
            is_email_sent: true,
        },
    });
});
exports.verify_code = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const user_id = req.user.id;
    const verified = yield utils_1.verifyCode(code, user_id);
    if (verified)
        return res.json({
            success: true,
            data: {
                verified,
            },
        });
    else
        return res.status(500).json({
            success: false,
            message: 'Oops! The verification code you entered is incorrect! Please try again!',
            data: {
                verified,
            },
        });
});
exports.forgot = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    console.log('#email', email);
    const user = yield utils_1.getUserByUsernameOrEmail(email);
    if (!user) {
        return res.status(403).json({
            success: false,
            message: 'This email does not exist in our system!',
        });
    }
    const token = yield utils_1.generateResetPasswordToken(user.id, req.originalUrl || req.url);
    yield Queue_1.default.add('ResetPasswordMail', { email, token });
    return res.json({
        success: true,
        message: 'Recovery link sent.',
        data: {
            is_sent: true,
        },
    });
});
exports.reset = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    try {
        const newPasswordToken = yield utils_1.verifyTokenAndUpdatePassword(token, password);
        req.login(newPasswordToken.User, (err) => {
            if (err) {
                return next(err);
            }
            const returnTo = newPasswordToken.returnTo;
            const queryParsedString = returnTo.indexOf('?') > -1
                ? returnTo.substr(returnTo.indexOf('?'), returnTo.length)
                : '';
            if (req.xhr) {
                return res.json({
                    success: true,
                    message: 'Successfully changed.',
                    data: {
                        returnTo: `/oauth2/authorize${queryParsedString}`,
                    },
                });
            }
            else {
                return res.redirect(`/oauth2/authorize?${queryParsedString}`);
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
