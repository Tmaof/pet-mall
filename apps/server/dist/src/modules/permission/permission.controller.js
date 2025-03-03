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
exports.PermissionController = void 0;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("./permission.service");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const utils_1 = require("../../utils");
const permCode_1 = require("../../constant/permCode");
const index_decorator_1 = require("../../decorator/index.decorator");
const jwt_guard_1 = require("../../guards/jwt.guard");
const perm_guard_1 = require("../../guards/perm.guard");
let PermissionController = class PermissionController {
    constructor(permissionService) {
        this.permissionService = permissionService;
    }
    addPermission(dto) {
        this.permissionService.create(dto);
        return (0, utils_1.getCommonRes)();
    }
    async getPermissionList() {
        const res = await this.permissionService.getPermissionList();
        return (0, utils_1.getCommonRes)(res);
    }
    async deletePermission(permissionId) {
        const res = await this.permissionService.delete(permissionId);
        return (0, utils_1.getCommonRes)(res);
    }
};
exports.PermissionController = PermissionController;
__decorate([
    (0, common_1.Post)('add'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.menuList.children.addPerm),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", void 0)
], PermissionController.prototype, "addPermission", null);
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "getPermissionList", null);
__decorate([
    (0, common_1.Delete)(':permissionId'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.menuList.children.deletePerm),
    __param(0, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionController.prototype, "deletePermission", null);
exports.PermissionController = PermissionController = __decorate([
    (0, common_1.Controller)('permission'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.menuList),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, perm_guard_1.PermGuard),
    __metadata("design:paramtypes", [permission_service_1.PermissionService])
], PermissionController);
//# sourceMappingURL=permission.controller.js.map