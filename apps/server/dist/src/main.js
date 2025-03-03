"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const validation_pipe_1 = require("./pipes/validation.pipe");
const all_exception_filter_1 = require("./filters/all-exception.filter");
const config_1 = require("../config");
const config_enum_1 = require("../config/env/config.enum");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const httpAdapter = app.get(core_1.HttpAdapterHost);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(validation_pipe_1.ReqValidationPipe);
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionFilter(httpAdapter));
    const port = config_1.serverConfig[config_enum_1.ConfigEnum.APP_PORT];
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map