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
exports.Permission = void 0;
const role_entity_1 = require("../role/role.entity");
const typeorm_1 = require("typeorm");
let Permission = class Permission {
};
exports.Permission = Permission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '权限ID，主键' }),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '权限名称' }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '权限类型。为1代表页面权限，为2代表按钮权限。' }),
    __metadata("design:type", Number)
], Permission.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '权限代码，唯一', unique: true }),
    __metadata("design:type", String)
], Permission.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role, (role) => role.permission, { cascade: ['remove'] }),
    (0, typeorm_1.JoinTable)({ name: 'role_permission' }),
    __metadata("design:type", Array)
], Permission.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Permission, (permission) => permission.parentPermission),
    __metadata("design:type", Array)
], Permission.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Permission, (permission) => permission.children),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Permission)
], Permission.prototype, "parentPermission", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Entity)('permission')
], Permission);
//# sourceMappingURL=permission.entity.js.map