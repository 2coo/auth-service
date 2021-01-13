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
exports.isAuthenticated = void 0;
const graphql_shield_1 = require("graphql-shield");
const apollo_server_core_1 = require("apollo-server-core");
exports.isAuthenticated = graphql_shield_1.rule()((parent, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ctx.req.cookies['access_token'] &&
        !ctx.req.headers.authorization) {
        return new apollo_server_core_1.AuthenticationError('Unauthenticated.');
    }
    // At this point, you're guaranteed that you're authenticated so we return true directly.
    return true;
}));
