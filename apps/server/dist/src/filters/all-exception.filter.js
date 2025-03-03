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
exports.AllExceptionFilter = void 0;
const enum_1 = require("../enum");
const utils_1 = require("../utils");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
let AllExceptionFilter = class AllExceptionFilter {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(exception, host) {
        var _a;
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const httpStatus = exception instanceof common_1.HttpException ? exception.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let msg = ((_a = exception === null || exception === void 0 ? void 0 : exception.response) === null || _a === void 0 ? void 0 : _a.message) || 'Internal Server Error';
        if (exception instanceof typeorm_1.QueryFailedError) {
            msg = exception.message;
        }
        const res = (0, utils_1.getCommonRes)({ success: false, code: enum_1.ResCodeEnum.fail, message: msg });
        console.error(exception);
        httpAdapter.reply(response, res, httpStatus);
    }
};
exports.AllExceptionFilter = AllExceptionFilter;
exports.AllExceptionFilter = AllExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], AllExceptionFilter);
//# sourceMappingURL=all-exception.filter.js.map