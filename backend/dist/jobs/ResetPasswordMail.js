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
exports.ResetPasswordMail = void 0;
const Mail_1 = require("../lib/Mail");
const mail_1 = require("../config/mail");
const system_1 = require("../config/system");
exports.ResetPasswordMail = {
    key: 'ResetPasswordMail',
    handle({ data }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, token } = data;
            yield Mail_1.default.sendMail({
                from: mail_1.default.from,
                to: email,
                subject: '[Important Action Required] Reset your TOMUJIN DIGITAL password',
                html: `<p>It's okay! This happens to the best of us.</p>
      <a href="http://${system_1.default.domain}/login/reset?token=${token}">Reset Password</a>
      `,
            });
        });
    },
};
