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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const role_entity_1 = require("../role/role.entity");
const user_log_entity_1 = require("../user-log/user-log.entity");
let User = class User {
    constructor(user) {
        this.openTime = new Date();
        this.avatar = 'https://www.maofu123.top/qiniuyun-68aaec38a9bcb79c31fc90738b18e603-maofu-%E5%8A%A8%E6%BC%AB%E5%A4%B4%E5%83%8F.webp';
        this.gender = 0;
        Object.assign(this, user);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '员工ID，主键' }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, comment: '用户名' }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '密码' }),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', comment: '开通时间' }),
    __metadata("design:type", Date)
], User.prototype, "openTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '头像URL' }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '性别' }),
    __metadata("design:type", Number)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role, (role) => role.user, { cascade: ['insert'] }),
    (0, typeorm_1.JoinTable)({ name: 'user_role' }),
    __metadata("design:type", Array)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_log_entity_1.UserLog, (userLog) => userLog.user),
    __metadata("design:type", Array)
], User.prototype, "log", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('user'),
    __metadata("design:paramtypes", [Object])
], User);
//# sourceMappingURL=user.entity.js.map