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
exports.UserLogController = void 0;
const common_1 = require("@nestjs/common");
const user_log_service_1 = require("./user-log.service");
const utils_1 = require("../../utils");
const get_dto_1 = require("./dto-req/get.dto");
const delete_dto_1 = require("./dto-req/delete.dto");
const perm_guard_1 = require("../../guards/perm.guard");
const jwt_guard_1 = require("../../guards/jwt.guard");
const permCode_1 = require("../../constant/permCode");
const index_decorator_1 = require("../../decorator/index.decorator");
let UserLogController = class UserLogController {
    constructor(userLogService) {
        this.userLogService = userLogService;
    }
    async getUsersPaging(query) {
        const data = await this.userLogService.findAllPaging(query);
        return (0, utils_1.getCommonRes)({ data });
    }
    async deleteUserlogByTimeRange(dto) {
        const res = await this.userLogService.deleteUserlogByTimeRange(dto);
        return (0, utils_1.getCommonRes)(res);
    }
};
exports.UserLogController = UserLogController;
__decorate([
    (0, common_1.Get)('/paging'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_dto_1.GetUserLogAllPagingDto]),
    __metadata("design:returntype", Promise)
], UserLogController.prototype, "getUsersPaging", null);
__decorate([
    (0, common_1.Delete)('/time-range'),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.logManage.children.userLog.children.deleteUserLog),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_dto_1.DeleteUserLogByTimeRangeDto]),
    __metadata("design:returntype", Promise)
], UserLogController.prototype, "deleteUserlogByTimeRange", null);
exports.UserLogController = UserLogController = __decorate([
    (0, common_1.Controller)('user-log'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard, perm_guard_1.PermGuard),
    (0, index_decorator_1.setNeedPerm)(permCode_1.permTree.logManage.children.userLog),
    __metadata("design:paramtypes", [user_log_service_1.UserLogService])
], UserLogController);
//# sourceMappingURL=user-log.controller.js.map