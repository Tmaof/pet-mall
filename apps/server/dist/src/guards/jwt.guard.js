"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtGuard = void 0;
const passport_1 = require("@nestjs/passport");
class JwtGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor() {
        super();
    }
    async canActivate(context) {
        const parentCanActivate = (await super.canActivate(context));
        return parentCanActivate;
    }
}
exports.JwtGuard = JwtGuard;
//# sourceMappingURL=jwt.guard.js.map