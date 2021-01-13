"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAbility = void 0;
const ability_1 = require("@casl/ability");
ability_1.ForbiddenError.setDefaultMessage('Unauthorized!');
function createAbility(rules) {
    return new ability_1.Ability(rules);
}
exports.createAbility = createAbility;
