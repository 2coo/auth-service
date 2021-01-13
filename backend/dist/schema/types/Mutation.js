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
exports.Mutation = void 0;
const nexus_1 = require("nexus");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
exports.Mutation = nexus_1.mutationType({
    definition(t) {
        t.nullable.field('login', {
            type: 'AuthPayload',
            args: {
                email: nexus_1.nonNull(nexus_1.stringArg()),
                password: nexus_1.nonNull(nexus_1.stringArg()),
            },
            resolve(_parent, { email, password }, ctx) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield ctx.prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });
                    if (!user) {
                        throw new Error(`No user found for email: ${email}`);
                    }
                    const passwordValid = yield bcryptjs_1.compare(password, user.password);
                    if (!passwordValid) {
                        throw new Error('Invalid password');
                    }
                    return {
                        token: jsonwebtoken_1.sign({ userId: user.id }, '1231', {
                            expiresIn: '1 day',
                        }),
                        user: user,
                    };
                });
            },
        });
        t.crud.createOneUser();
    },
});
