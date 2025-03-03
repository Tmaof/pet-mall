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
exports.UserLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_log_entity_1 = require("./user-log.entity");
const user_service_1 = require("../user/user.service");
const requestIp = require("request-ip");
const utils_1 = require("../../utils");
const constant_1 = require("./constant");
let UserLogService = class UserLogService {
    constructor(userLogRepository, userService) {
        this.userLogRepository = userLogRepository;
        this.userService = userService;
    }
    async create(dto) {
        const { userId, logInfo } = dto;
        const user = await this.userService.findOne(userId);
        if (!user) {
            return { message: '用户不存在' };
        }
        const role = this.userLogRepository.create(Object.assign(Object.assign({}, logInfo), { user }));
        const data = await this.userLogRepository.save(role);
        return { message: '添加成功', data };
    }
    async recordUserLog(request, data, startTime) {
        const userInfo = request.user;
        if (!userInfo) {
            return;
        }
        const user = await this.userService.findOne(userInfo.userId);
        if (!user) {
            return;
        }
        const logInfo = (0, utils_1.objToJsonStr)({
            reqHeader: request.headers,
            reqQuery: request.query,
            reqBody: request.body,
            reqParams: request.params,
            time: new Date(),
            ip: requestIp.getClientIp(request),
            path: request.url,
            methods: request.method,
            resBody: constant_1.noResBodyPath.find((path) => request.url.includes(path)) ? '' : data,
            handeTime: Date.now() - startTime,
        }, ['time', 'handeTime']);
        const createUserLogDto = {
            userId: user.id,
            logInfo,
        };
        this.create(createUserLogDto);
    }
    async findAllPaging(dto) {
        const { size, page, userId, startDateStr, endDateStr, sortBy, sortOrder } = dto;
        const take = size || 2;
        const skip = ((page || 1) - 1) * take;
        const where = {};
        if (userId) {
            const user = await this.userService.findOne(userId);
            if (user) {
                where.user = user;
            }
            else {
                return { list: [], total: 0, page, size };
            }
        }
        if (startDateStr) {
            const startDate = new Date(startDateStr);
            const endDate = new Date(endDateStr || new Date());
            where.time = (0, typeorm_2.Between)(startDate, endDate);
        }
        const order = {};
        if (sortBy) {
            order[sortBy] = (sortOrder === null || sortOrder === void 0 ? void 0 : sortOrder.toUpperCase()) === 'DESC' ? 'DESC' : 'ASC';
        }
        else {
            order.time = 'DESC';
        }
        const userLogs = await this.userLogRepository.find({
            take,
            skip,
            where,
            relations: ['user'],
            order,
        });
        userLogs.forEach((userLog) => {
            userLog.user.password = undefined;
        });
        const total = await this.userLogRepository.count({ where });
        return {
            list: userLogs,
            total,
            page,
            size,
        };
    }
    async deleteUserlogByTimeRange(dto) {
        const { startDateStr, endDateStr } = dto;
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            return { message: '日期格式不正确' };
        }
        if (startDate > endDate) {
            return { message: '开始日期不能大于结束日期' };
        }
        const count = await this.userLogRepository.count({ where: { time: (0, typeorm_2.Between)(startDate, endDate) } });
        if (count === 0) {
            return { message: '指定时间范围内没有日志记录' };
        }
        await this.userLogRepository.delete({ time: (0, typeorm_2.Between)(startDate, endDate) });
    }
};
exports.UserLogService = UserLogService;
exports.UserLogService = UserLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_log_entity_1.UserLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService])
], UserLogService);
//# sourceMappingURL=user-log.service.js.map