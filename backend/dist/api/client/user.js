"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUser = void 0;
class AppUser {
    constructor(payload) {
        this.canScope = (scope) => {
            if (this.payload.token_use === 'access')
                return this.payload.scopes.indexOf(scope) > -1;
            return false;
        };
        this.getGroups = () => {
            var _a;
            return (_a = this.payload.groups) !== null && _a !== void 0 ? _a : [];
        };
        this.getRoles = () => {
            if (this.payload.token_use === 'access')
                return this.payload.roles;
        };
        this.payload = payload;
    }
}
exports.AppUser = AppUser;
