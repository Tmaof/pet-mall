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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const argon2 = require("argon2");
const role_entity_1 = require("../role/role.entity");
const permission_entity_1 = require("../permission/permission.entity");
const enum_1 = require("../permission/enum");
let UserService = class UserService {
    constructor(userRepository, roleRepository, permissionRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
    async getCurrentUser(jwtPayload) {
        const user = await this.userRepository.findOne({
            where: { id: jwtPayload.userId, username: jwtPayload.username },
            relations: ['role'],
        });
        if (!user) {
            return { message: '用户不存在' };
        }
        const queryList = user.role.map(item => ({ id: item.id }));
        let roles = [];
        if (queryList.length) {
            roles = await this.roleRepository.find({ where: queryList, relations: ['permission'] });
        }
        const menus = new Set();
        const points = new Set();
        for (const role of roles) {
            for (const permission of role.permission) {
                if (permission.type === enum_1.PermissionTypeEnum.page) {
                    menus.add(permission.code);
                }
                else if (permission.type === enum_1.PermissionTypeEnum.pont) {
                    points.add(permission.code);
                }
            }
        }
        const userInfo = Object.assign(Object.assign({}, user), { role: roles.map(item => item.id), permission: {
                menus: Array.from(menus),
                points: Array.from(points),
            } });
        delete userInfo.password;
        delete userInfo.log;
        return userInfo;
    }
    async getUserPermCode(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['role'],
        });
        if (!user || !user.role.length) {
            return new Set();
        }
        const queryList = user.role.map(item => ({ id: item.id }));
        let roles = [];
        if (queryList.length) {
            roles = await this.roleRepository.find({ where: queryList, relations: ['permission'] });
        }
        const codeList = new Set();
        for (const role of roles) {
            for (const permission of role.permission) {
                codeList.add(permission.code);
            }
        }
        return codeList;
    }
    async findAllPaging(dto) {
        const { size, page } = dto;
        const take = size || 2;
        const skip = ((page || 1) - 1) * take;
        const users = await this.userRepository.find({ relations: { role: true }, take, skip });
        users.forEach((user) => {
            delete user.password;
        });
        const total = await this.userRepository.count();
        return {
            list: users,
            total,
            page,
            size,
        };
    }
    async findAllExcel() {
        const users = await this.userRepository.find({
            select: {
                id: true,
                username: true,
                avatar: true,
                openTime: true,
            },
            relations: { role: true },
        });
        const data = { list: [] };
        users.forEach((user) => {
            data.list.push({
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                openTime: user.openTime.toDateString(),
                role: user.role.map((item) => item.name).join(','),
            });
        });
        return data;
    }
    async findUserRole(dto) {
        const user = await this.userRepository.findOne({
            where: { id: dto.userId },
            relations: { role: true },
        });
        return { role: user.role };
    }
    findByUsername(username) {
        return this.userRepository.findOne({
            where: { username },
            relations: ['role', 'role.permission'],
        });
    }
    findOne(userId) {
        return this.userRepository.findOne({ where: { id: userId } });
    }
    async create(user) {
        const userTmp = this.userRepository.create(user);
        userTmp.password = await argon2.hash(userTmp.password);
        const res = await this.userRepository.save(userTmp);
        return res;
    }
    async createBatch({ payload }) {
        const usersToSave = [];
        const messageList = [];
        for (const item of payload) {
            const { username, password, role = '', openTime = '' } = item;
            const existingUser = await this.userRepository.findOne({ where: { username } });
            if (existingUser) {
                console.error(`用户名 ${username} 已存在，跳过该用户`);
                messageList.push(`用户名 ${username} 已存在，跳过该用户`);
                continue;
            }
            const rolesArray = role.split(/,|，/).map(name => name.trim());
            const findList = rolesArray.map(name => ({ name }));
            const roles = await this.roleRepository.find({ where: findList });
            const user = this.userRepository.create({
                username,
                password: await argon2.hash(password),
                openTime: openTime ? new Date(openTime) : new Date(),
                role: roles,
            });
            usersToSave.push(user);
        }
        const message = messageList.length === 0 ? '添加成功' : messageList.map((item, index) => `${index + 1}. ${item}\n`).join('');
        if (usersToSave.length > 0) {
            await this.userRepository.save(usersToSave);
        }
        return { message };
    }
    async updateUserRole(dto) {
        const { userId, payload } = dto;
        if (payload.length === 0) {
            return;
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return { message: '用户不存在' };
        }
        const queryList = payload.map(item => {
            return { id: item.id };
        });
        const roles = await this.roleRepository.find({ where: queryList });
        user.role = roles;
        await this.userRepository.save(user);
    }
    update() {
    }
    async remove(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return { message: '用户不存在' };
        }
        this.userRepository.remove(user);
        return { message: '删除成功' };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map