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
exports.PermissionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("./permission.entity");
const enum_1 = require("../../enum");
let PermissionService = class PermissionService {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async create(dto) {
        if (dto.pid) {
            const parentPermission = await this.permissionRepository.findOne({ where: { id: dto.pid } });
            if (!parentPermission) {
                return { message: '父权限不存在' };
            }
            const newPermission = Object.assign(Object.assign({}, dto), { parentPermission });
            const permission = this.permissionRepository.create(newPermission);
            return await this.permissionRepository.save(permission);
        }
        const permission = this.permissionRepository.create(dto);
        return await this.permissionRepository.save(permission);
    }
    async getPermissionList() {
        var _a;
        const permissionList = await this.permissionRepository.find({ relations: ['parentPermission'] });
        const getDtoItem = (permission, parentId) => {
            return { pid: parentId, name: permission.name, code: permission.code, type: permission.type, id: permission.id, children: [] };
        };
        const map = new Map();
        for (const permission of permissionList) {
            const parentId = (_a = permission.parentPermission) === null || _a === void 0 ? void 0 : _a.id;
            if (!parentId)
                continue;
            const dtoItem = getDtoItem(permission, parentId);
            if (map.has(parentId)) {
                map.get(parentId).push(dtoItem);
            }
            else {
                map.set(parentId, [dtoItem]);
            }
        }
        const rootList = permissionList.filter(permission => !permission.parentPermission).map(permission => getDtoItem(permission, -1));
        const dfs = (list) => {
            for (const dtoItem of list) {
                if (map.has(dtoItem.id)) {
                    dtoItem.children = map.get(dtoItem.id) || [];
                    dfs(dtoItem.children);
                }
            }
        };
        dfs(rootList);
        return { data: rootList };
    }
    async delete(permissionId) {
        const queryRunner = this.permissionRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
            if (!permission) {
                throw new Error('权限不存在');
            }
            const dfsDelete = async (permission) => {
                const children = await this.permissionRepository.find({ where: { parentPermission: permission } });
                for (const child of children) {
                    await dfsDelete(child);
                }
                await this.permissionRepository.delete(permission.id);
            };
            await dfsDelete(permission);
            await queryRunner.commitTransaction();
            return { message: '删除成功' };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(error.message);
            return { message: `删除失败:${error.message}`, success: false, code: enum_1.ResCodeEnum.fail };
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.PermissionService = PermissionService;
exports.PermissionService = PermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionService);
//# sourceMappingURL=permission.service.js.map