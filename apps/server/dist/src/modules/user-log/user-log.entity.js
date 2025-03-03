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
exports.UserLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
let UserLog = class UserLog {
};
exports.UserLog = UserLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '日志ID' }),
    __metadata("design:type", Number)
], UserLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求路径' }),
    __metadata("design:type", String)
], UserLog.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求方法' }),
    __metadata("design:type", String)
], UserLog.prototype, "methods", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求头', type: 'text' }),
    __metadata("design:type", String)
], UserLog.prototype, "reqHeader", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求数据', type: 'text' }),
    __metadata("design:type", String)
], UserLog.prototype, "reqBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求数据', type: 'text' }),
    __metadata("design:type", String)
], UserLog.prototype, "reqQuery", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求数据', type: 'text' }),
    __metadata("design:type", String)
], UserLog.prototype, "reqParams", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求结果', type: 'text' }),
    __metadata("design:type", String)
], UserLog.prototype, "resBody", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求ip' }),
    __metadata("design:type", String)
], UserLog.prototype, "ip", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求时间' }),
    __metadata("design:type", Date)
], UserLog.prototype, "time", void 0);
__decorate([
    (0, typeorm_1.Column)({ comment: '请求处理时间，单位毫秒' }),
    __metadata("design:type", Number)
], UserLog.prototype, "handeTime", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.log),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], UserLog.prototype, "user", void 0);
exports.UserLog = UserLog = __decorate([
    (0, typeorm_1.Entity)('user_log')
], UserLog);
//# sourceMappingURL=user-log.entity.js.map