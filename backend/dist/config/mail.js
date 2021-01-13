"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    host: String(process.env.MAIL_HOST),
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: String(process.env.MAIL_USER),
        pass: String(process.env.MAIL_PASS),
    },
    from: String(process.env.MAIL_FROM),
};
