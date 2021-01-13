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
exports.getGoogleUserInfo = exports.getAccessTokenFromCode = exports.getAuthorizeURL = void 0;
const queryString = require("query-string");
const axios_1 = require("axios");
exports.getAuthorizeURL = (clientId, scope, redirect_uri, state) => {
    const stringifiedParams = queryString.stringify({
        client_id: clientId,
        redirect_uri: redirect_uri,
        scope: scope,
        response_type: 'code',
        state: Buffer.from(state).toString('base64'),
    });
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?${stringifiedParams}`;
    return googleLoginUrl;
};
exports.getAccessTokenFromCode = (code, clientId, clientSecret, redirect_uri) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code',
            code,
        },
    });
    return data.access_token;
});
exports.getGoogleUserInfo = (access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    console.log(data); // { id, email, given_name, family_name }
    return data;
});
