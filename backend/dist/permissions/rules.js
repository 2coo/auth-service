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
exports.can = void 0;
const graphql_shield_1 = require("graphql-shield");
const ability_1 = require("@casl/ability");
/**
 * Refer to system ability in authorization for the valid actions and subjects.
 *
 * Note: If you you have conditions or field restrictions,
 * make sure to do a comprehensive check in your resolvers.
 * We do not do it here as what you receive in the args does
 * not always match your database column names so it's better
 * to do it after this layer.
 */
exports.can = (action, subject) => graphql_shield_1.rule()((parent, args, { ability }) => __awaiter(void 0, void 0, void 0, function* () {
    ability_1.ForbiddenError.from(ability).throwUnlessCan(action, subject);
    return true;
}));
