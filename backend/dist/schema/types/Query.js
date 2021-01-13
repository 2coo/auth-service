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
exports.Query = void 0;
const nexus_1 = require("nexus");
exports.Query = nexus_1.queryType({
    definition(t) {
        t.field('Test', {
            type: 'String',
            resolve: (_parent, args, { prisma }, info) => __awaiter(this, void 0, void 0, function* () {
                return 'Hi';
            }),
        });
        t.crud.user();
        t.crud.users({
            filtering: true,
            ordering: true
        });
    },
});
