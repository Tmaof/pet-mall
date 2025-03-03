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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const role_entity_1 = require("./role.entity");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../permission/permission.entity");
const permission_service_1 = require("../permission/permission.service");
let RolesService = class RolesService {
    constructor(roleRepository, permissionRepository, permissionService) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.permissionService = permissionService;
    }
    async getRoleList() {
        const roles = await this.roleRepository.find({ relations: ['permission'] });
        const res = [];
        for (const role of roles) {
            const { id, name, describe, permission } = role;
            const names = permission.map(item => item.name);
            const permissions = permission.map(item => item.id);
            res.push({ id, name, describe, permissions, names });
        }
        return { data: res };
    }
    async getRolePermission(roleId) {
        const role = await this.roleRepository.findOne({ where: { id: roleId }, relations: ['permission'] });
        if (!role) {
            return { message: '角色不存在' };
        }
        const selected = role.permission.map(item => item.id);
        const list = [];
        const { data: permissionList } = await this.permissionService.getPermissionList();
        const addSelectFlag = (permissionList, resList, selectedList) => {
            for (const permission of permissionList) {
                const { id, pid, name, code, type, children } = permission;
                const select = selectedList.includes(id) ? 1 : 0;
                const item = { id, pid, name, code, type, select, children: [] };
                if (children.length > 0) {
                    addSelectFlag(children, item.children, selectedList);
                }
                resList.push(item);
            }
        };
        addSelectFlag(permissionList, list, selected);
        const data = { selected, list };
        return { data };
    }
    async create(dto) {
        const role = this.roleRepository.create(dto);
        return await this.roleRepository.save(role);
    }
    async updateRolePermission(dto) {
        const { roleId, permissionIdList } = dto;
        if (permissionIdList.length === 0) {
            return;
        }
        const role = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!role) {
            return { message: '角色不存在' };
        }
        const queryList = permissionIdList.map(item => {
            return { id: item };
        });
        let permission = [];
        if (queryList.length) {
            permission = await this.permissionRepository.find({ where: queryList });
        }
        role.permission = permission;
        await this.roleRepository.save(role);
    }
    async delete(id) {
        const role = await this.roleRepository.findOne({ where: { id } });
        if (!role) {
            return { message: '角色不存在' };
        }
        await this.roleRepository.delete(id);
        return { message: '删除成功' };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        permission_service_1.PermissionService])
], RolesService);
//# sourceMappingURL=role.service.js.map