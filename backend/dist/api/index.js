"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connectRedis = require("connect-redis");
const errorHandler = require("errorhandler");
const Express = require("express");
const expressSession = require("express-session");
const passport = require("passport");
const path = require("path");
const redis = require("redis");
const serveStatic = require("serve-static");
const client_1 = require("./client");
const index_1 = require("./client/index");
const controllers_1 = require("./controllers");
const redis_1 = require("../config/redis");
const system_1 = require("../config/system");
const vhost = require('vhost');
// const corsOptions = {
//   origin: ['http://localhost:3000'], //resource server
//   credentials: true,
//   allowedHeaders: 'X-Requested-With,content-type',
//   exposedHeaders: ['set-cookie'],
// }
const RedisStore = connectRedis(expressSession);
const DOMAIN = system_1.default.domain;
const redisClient = redis.createClient(Number(redis_1.default.port), redis_1.default.host, {
    no_ready_check: true,
});
module.exports = function (app) {
    app.use(Express.json());
    app.use(Express.urlencoded({
        extended: false,
    }));
    app.use(errorHandler());
    app.use(expressSession({
        name: 'TOMUJIN_DIGITAL_AUTH',
        saveUninitialized: true,
        resave: true,
        secret: system_1.default.session_secret,
        store: new RedisStore({ client: redisClient }),
        cookie: {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            // sameSite: 'strict', if you don't want SSO, it should be uncommented!
            httpOnly: true,
            maxAge: system_1.default.session_max_age,
        },
    }));
    // Use the passport package in our application
    app.use(passport.initialize());
    app.use(passport.session());
    // Custom Middlewares and Routes
    app.use(serveStatic(path.join(__dirname, '../../build'), {
        index: false,
    }));
    app.use((req, res, next) => {
        if (req.originalUrl.includes('favicon.ico')) {
            return res.status(204).end();
        }
        next();
    });
    app.use(index_1.loggerMiddleware);
    // Passport configuration
    require('./auth');
    // Routes
    const router = Express.Router();
    router.use(passport.authenticate('remember-me'));
    // tenant check
    router.use(index_1.tenantAndDefaultAppMiddleware);
    // Create endpoint handlers for oauth2 authorize
    router
        .route('/oauth2/authorize')
        .get([
        client_1.grantTypeCodeHandler(),
        client_1.grantTypeRefreshHandler(),
        client_1.verifyAppOrRedirect,
        controllers_1.default.oauth2.authorization,
    ])
        .post(controllers_1.default.site.login);
    router.post('/oauth2/register', controllers_1.default.site.register);
    router.post('/oauth2/register/get/fields', controllers_1.default.site.fields);
    router.post('/oauth2/forgot', controllers_1.default.site.forgot);
    router.post('/oauth2/reset', controllers_1.default.site.reset);
    router.get('/signup/validate-email', [client_1.verifySSO(), client_1.renderSPA]);
    router.get('/signup/validate-email/info', [
        client_1.verifySSO(),
        controllers_1.default.site.validate_email,
    ]);
    router.post('/signup/validate-email/code', [
        client_1.verifySSO(),
        controllers_1.default.site.verify_code,
    ]);
    router.get('/oauth2/userinfo', controllers_1.default.user.userinfo);
    router.get('/myabilities', controllers_1.default.user.abilities);
    router
        .route('/oauth2/authorize/dialog')
        .get([client_1.verifySSO(), client_1.verifyEmailIsVerified(), client_1.renderSPA])
        .post(controllers_1.default.oauth2.dialog);
    // error handler
    router.use(function (err, req, res, next) {
        console.log(err);
        // render the error page
        if (err.status !== undefined) {
            res.status(err.status);
            return res.json({
                success: false,
                message: err.message,
                error_description: err.description,
            });
        }
        next(err);
    });
    router.get('/locales/:locale/translation.json', (req, res, next) => {
        res.json({
            hi: 'tue',
        });
    });
    router
        .route('/oauth2/authorize/decision')
        .post(controllers_1.default.oauth2.decision)
        .get(controllers_1.default.oauth2.decision);
    // Create endpoint handlers for oauth2 token
    router.route('/oauth2/token').post(controllers_1.default.oauth2.token);
    router.route('/.well-known/jwks.json').get(controllers_1.default.token.jwks);
    router.post('/oauth2/token/revoke', controllers_1.default.token.revoke);
    router.get('/oauth2/providers', controllers_1.default.oauth2.providers);
    router.get('/oauth2/idpresponse', controllers_1.default.oauth2.idpresponse);
    // Create enpoints for AuthSystem (SPA)
    router.get('/', client_1.renderSPA);
    router
        .route('/login')
        .get(controllers_1.default.oauth2.authorization)
        .post((req, res, next) => {
        req.query.client_id = req.session.defaultApp.id;
        next();
    }, controllers_1.default.site.login);
    router.get('/logout', [controllers_1.default.site.logout, client_1.renderSPA]);
    router.get(/^\/app(\/.*)?/, [client_1.verifySSO(), client_1.verifyEmailIsVerified(), client_1.renderSPA]);
    router.get('*', client_1.renderSPA);
    //subdomain tenant
    app.use(vhost(`*.${DOMAIN}`, router));
    app.use(vhost(`${DOMAIN}`, router));
    app.use(router);
};
