"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermGuard = void 0;
const constant_1 = require("../constant");
const permCode_1 = require("../constant/permCode");
const user_service_1 = require("../modules/staff/user/user.service");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let PermGuard = class PermGuard {
    constructor(reflector, userService) {
        this.reflector = reflector;
        this.userService = userService;
    }
    async canActivate(context) {
        const routeNeedPerm = this.reflector.get(constant_1.NEED_PERMISSION_CODE, context.getHandler());
        const controllerNeedPerm = this.reflector.get(constant_1.NEED_PERMISSION_CODE, context.getClass());
        if (!routeNeedPerm && !controllerNeedPerm) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        if (!request.user) {
            console.warn('权限守卫：用户未登录，没有request.user');
            return false;
        }
        const user = await this.userService.findOne(request.user.userId);
        if (!user) {
            console.warn('权限守卫：用户不存在');
            return false;
        }
        const userPermCodeSet = await this.userService.getUserPermCode(user.id);
        if (routeNeedPerm) {
            const needPermCode = routeNeedPerm.code;
            if (needPermCode === permCode_1.permTree.userPublic.code) {
                return true;
            }
            if (userPermCodeSet.has(needPermCode)) {
                return true;
            }
            console.warn(`权限守卫：用户 ${user.username} 没有 ${needPermCode} 权限`);
            return false;
        }
        if (controllerNeedPerm) {
            const needPermCode = controllerNeedPerm.code;
            if (needPermCode === permCode_1.permTree.userPublic.code) {
                return true;
            }
            if (userPermCodeSet.has(needPermCode)) {
                return true;
            }
            console.warn(`权限守卫：用户 ${user.username} 没有 ${needPermCode} 权限`);
            return false;
        }
        console.warn(`权限守卫：用户 ${user.username} 没有该api权限`);
        return false;
    }
};
exports.PermGuard = PermGuard;
exports.PermGuard = PermGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        user_service_1.UserService])
], PermGuard);
//# sourceMappingURL=perm.guard.js.map