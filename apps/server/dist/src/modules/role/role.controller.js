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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("./role.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const utils_1 = require("../../utils");
const update_role_permission_dto_1 = require("./dto/update-role-permission.dto");
const jwt_guard_1 = require("../../guards/jwt.guard");
const perm_guard_1 = require("../../guards/perm.guard");
const permCode_1 = require("../../constant/permCode");
const index_decorator_1 = require("../../decorator/index.decorator");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async getRoleList() {
        const data = await this.rolesService.getRoleList();
        return (0, utils_1.getCommonRes)(data);
    }
    async getRolePermission(roleId) {
        const res = await this.rolesService.getRolePermission(roleId);
        return (0, utils_1.getCommonRes)(res);
    }
    addRole(dto) {
        this.rolesService.create(dto);
        return (0, utils_1.getCommonRes)();
    }
    async updateRolePermission(dto) {
        const data = await this.rolesService.updateRolePermission(dto);
        return (0, utils_1.getCommonRes)(data);
    }
    async deleteRole(roleId) {
        const data = await this.rolesService.delete(roleId);
        return (0, utils_1.getCommonRes)(data);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getRoleList", null);
__decorate([
    (0, common_1.Get)('permission/:roleId'),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "getRolePermission", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.roleList.children.addRole),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "addRole", null);
__decorate([
    (0, common_1.Post)('update/permission'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.roleList.children.assignPerm),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_role_permission_dto_1.UpdateRolePermissionDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "updateRolePermission", null);
__decorate([
    (0, common_1.Delete)(':roleId'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.roleList.children.deleteRole),
    __param(0, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "deleteRole", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('role'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.permManage.children.roleList),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, perm_guard_1.PermGuard),
    __metadata("design:paramtypes", [role_service_1.RolesService])
], RolesController);
//# sourceMappingURL=role.controller.js.map