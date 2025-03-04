import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './modules/staff/user/user.module';
import { AuthModule } from './modules/staff/auth/auth.module';
import { RolesModule } from './modules/staff/role/role.module';
import { PermissionModule } from './modules/staff/permission/permission.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { UserLogModule } from './modules/staff/user-log/user-log.module';
import { entitiesPaths, envFilePathAll } from 'config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'config/env/config.enum';
import { CategoryModule } from './modules/product/category/category.module';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            // 全局可用 ConfigService
            isGlobal: true,
            // 环境变量文件路径
            envFilePath: envFilePathAll,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (cs:ConfigService) => {
                const dbConfig =  ({
                    type: cs.get(ConfigEnum.DB_TYPE),
                    host: cs.get(ConfigEnum.DB_HOST),
                    port: cs.get(ConfigEnum.DB_PORT),
                    username: cs.get(ConfigEnum.DB_USERNAME),
                    password: cs.get(ConfigEnum.DB_PASSWORD),
                    database: cs.get(ConfigEnum.DB_DATABASE),
                    entities: entitiesPaths,
                    // 同步本地的schema与数据库 -> 初始化的时候去使用
                    synchronize: cs.get(ConfigEnum.DB_SYNC),
                    logging: cs.get(ConfigEnum.DB_LOGGING),
                }) as TypeOrmModuleOptions;
                console.info('TypeOrm配置：', dbConfig);
                return dbConfig;
            },
        }),
        // 员工相关模块
        UserModule,
        AuthModule,
        RolesModule,
        PermissionModule,
        UserLogModule,
        // 产品相关模块
        CategoryModule,
    ],
    controllers: [],
    /** 可选的提供者列表，这些提供者将由 Nest 注入器实例化，并且至少可以在此模块之间共享。 */
    providers: [
        // 全局拦截器
        {
            provide: APP_INTERCEPTOR,
            useClass: GlobalInterceptor,
        },
    ],
})
export class AppModule {}
