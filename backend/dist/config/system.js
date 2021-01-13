"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    domain: String(process.env.DOMAIN || 'auth.test'),
    app_secret: String(process.env.APP_SECRET || 'app$!23secret'),
    session_secret: process.env.SESSION_SECRET || 's4per$ecret',
    session_max_age: Number(process.env.SESSION_MAX_AGE || 3600),
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASSWORD,
    jwt_default_issuer: String(process.env.JWT_DEFAULT_ISSUER || 'http://tomujin.digital'),
};
