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
exports.Role = void 0;
const permission_entity_1 = require("../permission/permission.entity");
const user_entity_1 = require("../user/user.entity");
const typeorm_1 = require("typeorm");
let Role = class Role {
};
exports.Role = Role;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '角色ID，主键' }),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '角色名称', unique: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '角色描述', default: '' }),
    __metadata("design:type", String)
], Role.prototype, "describe", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.role),
    (0, typeorm_1.JoinTable)({ name: 'user_role' }),
    __metadata("design:type", Array)
], Role.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => permission_entity_1.Permission, (Permission) => Permission.role),
    (0, typeorm_1.JoinTable)({ name: 'role_permission' }),
    __metadata("design:type", Array)
], Role.prototype, "permission", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('role')
], Role);
//# sourceMappingURL=role.entity.js.map