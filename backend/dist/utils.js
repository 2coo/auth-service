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
exports.createOrConnectRole = exports.connectDefaultUserScopes = exports.createGrantTypesAndConnect = exports.getUserId = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const system_1 = require("./config/system");
exports.getUserId = (context) => {
    const Authorization = context.req.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const verifiedToken = jsonwebtoken_1.verify(token, system_1.default.app_secret);
        return verifiedToken;
    }
    return { userId: null };
};
exports.createGrantTypesAndConnect = (prisma, clientId) => __awaiter(void 0, void 0, void 0, function* () {
    const grantTypes = [
        { grantType: client_1.GrantType.AUTHORIZATION_CODE },
        { grantType: client_1.GrantType.CLIENT_CREDENTIALS },
        { grantType: client_1.GrantType.EXTENSION },
        { grantType: client_1.GrantType.PASSWORD },
        { grantType: client_1.GrantType.REFRESH_TOKEN },
    ].map((grantType) => (Object.assign(Object.assign({}, grantType), { Clients: {
            connect: {
                id: clientId,
            },
        } })));
    const manyGrantTypes = grantTypes.map((grantType) => prisma.grant.create({
        data: grantType,
    }));
    prisma.$transaction(manyGrantTypes);
});
exports.connectDefaultUserScopes = (prisma, id) => __awaiter(void 0, void 0, void 0, function* () {
    const scopes = prisma.application.update({
        where: {
            id,
        },
        data: {
            EnabledScopes: {
                connect: [
                    {
                        name: 'user',
                    },
                    {
                        name: 'read:user',
                    },
                    {
                        name: 'user:email',
                    },
                    {
                        name: 'user:follow',
                    },
                ],
            },
        },
    });
    prisma.$transaction([scopes]);
});
exports.createOrConnectRole = (prisma, id) => __awaiter(void 0, void 0, void 0, function* () {
    prisma.user.update({
        where: {
            id,
        },
        data: {
            Groups: {
                connect: {
                    name: 'default',
                },
            },
        },
    });
});
