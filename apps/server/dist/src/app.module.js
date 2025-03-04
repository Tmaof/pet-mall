"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./modules/staff/user/user.module");
const auth_module_1 = require("./modules/staff/auth/auth.module");
const role_module_1 = require("./modules/staff/role/role.module");
const permission_module_1 = require("./modules/staff/permission/permission.module");
const core_1 = require("@nestjs/core");
const global_interceptor_1 = require("./interceptors/global.interceptor");
const user_log_module_1 = require("./modules/staff/user-log/user-log.module");
const config_1 = require("../config");
const config_2 = require("@nestjs/config");
const config_enum_1 = require("../config/env/config.enum");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_2.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: config_1.envFilePathAll,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_2.ConfigService],
                useFactory: (cs) => {
                    const dbConfig = ({
                        type: cs.get(config_enum_1.ConfigEnum.DB_TYPE),
                        host: cs.get(config_enum_1.ConfigEnum.DB_HOST),
                        port: cs.get(config_enum_1.ConfigEnum.DB_PORT),
                        username: cs.get(config_enum_1.ConfigEnum.DB_USERNAME),
                        password: cs.get(config_enum_1.ConfigEnum.DB_PASSWORD),
                        database: cs.get(config_enum_1.ConfigEnum.DB_DATABASE),
                        entities: config_1.entitiesPaths,
                        synchronize: cs.get(config_enum_1.ConfigEnum.DB_SYNC),
                        logging: cs.get(config_enum_1.ConfigEnum.DB_LOGGING),
                    });
                    console.info('TypeOrm配置：', dbConfig);
                    return dbConfig;
                },
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            role_module_1.RolesModule,
            permission_module_1.PermissionModule,
            user_log_module_1.UserLogModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: global_interceptor_1.GlobalInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map