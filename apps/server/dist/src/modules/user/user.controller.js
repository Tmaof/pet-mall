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
exports.UserController = void 0;
const utils_1 = require("../../utils");
const create_user_batch_dto_1 = require("./dto/create-user-batch.dto");
const get_user_dto_1 = require("./dto/get-user.dto");
const user_service_1 = require("./user.service");
const common_1 = require("@nestjs/common");
const update_user_role_dto_1 = require("./dto/update-user-role.dto");
const jwt_guard_1 = require("../../guards/jwt.guard");
const index_decorator_1 = require("../../decorator/index.decorator");
const permCode_1 = require("../../constant/permCode");
const perm_guard_1 = require("../../guards/perm.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getCurrentUser(req) {
        const data = await this.userService.getCurrentUser(req.user);
        return (0, utils_1.getCommonRes)({ data });
    }
    async getUsersPaging(query) {
        const data = await this.userService.findAllPaging(query);
        return (0, utils_1.getCommonRes)({ data });
    }
    async getUsers() {
        const data = await this.userService.findAllExcel();
        return (0, utils_1.getCommonRes)({ data });
    }
    async getUserRole(dto) {
        const data = await this.userService.findUserRole(dto);
        return (0, utils_1.getCommonRes)({ data });
    }
    async addUserBatch(dto) {
        const data = await this.userService.createBatch(dto);
        return (0, utils_1.getCommonRes)(data);
    }
    async updateUserRole(dto) {
        const data = await this.userService.updateUserRole(dto);
        return (0, utils_1.getCommonRes)(data);
    }
    async removeUser(userId) {
        const data = await this.userService.remove(userId);
        return (0, utils_1.getCommonRes)(data);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('/profile'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.userPublic),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('/paging'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_dto_1.GetUserAllPagingDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsersPaging", null);
__decorate([
    (0, common_1.Get)('/batch/excel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Get)('/role/:userId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_user_dto_1.GetUserRoleDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserRole", null);
__decorate([
    (0, common_1.Post)('add/batch'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.userList.children.excelImport),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_batch_dto_1.CreateUserBatchDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUserBatch", null);
__decorate([
    (0, common_1.Post)('update/role'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.userList.children.assignRole),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_role_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Delete)('/:userId'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.userList.children.deleteUser),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.userList),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, perm_guard_1.PermGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map