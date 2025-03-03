"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReqValidationPipe = void 0;
const enum_1 = require("../enum");
const utils_1 = require("../utils");
const common_1 = require("@nestjs/common");
exports.ReqValidationPipe = new common_1.ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors) => {
        const messages = errors.map((error, index) => {
            return `[${index}]. ${Object.values(error.constraints).join(';')}`;
        });
        const res = (0, utils_1.getCommonRes)({ message: messages.join('\n'), success: false, code: enum_1.ResCodeEnum.reqArgError });
        return new common_1.BadRequestException(res);
    },
});
//# sourceMappingURL=validation.pipe.js.map