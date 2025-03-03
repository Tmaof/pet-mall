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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signin_user_dto_1 = require("./dto/signin-user.dto");
const utils_1 = require("../../utils");
const jwt_guard_1 = require("../../guards/jwt.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signin(dto) {
        const { username, password } = dto;
        const token = await this.authService.signin(username, password);
        return (0, utils_1.getCommonRes)({ data: { token } });
    }
    async signup(dto) {
        const { username, password } = dto;
        const data = await this.authService.signup(username, password);
        return (0, utils_1.getCommonRes)({ data });
    }
    async logout(req) {
        var _a, _b;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const token = (_b = req.user) === null || _b === void 0 ? void 0 : _b.token;
        await this.authService.logout({ userId, token });
        return (0, utils_1.getCommonRes)({ message: '退出登录成功' });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_user_dto_1.SigninUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_user_dto_1.SigninUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map