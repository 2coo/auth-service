"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const mail_1 = require("../config/mail");
exports.default = nodemailer.createTransport(mail_1.default);
