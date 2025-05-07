import { globalPrefix, serverConfig } from '@/config';
import { ConfigEnum } from '@/config/env/config.enum';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { ReqValidationPipe } from './pipes/validation.pipe';

/** */
async function bootstrap () {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const httpAdapter = app.get(HttpAdapterHost);
    // 设置全局前缀
    app.setGlobalPrefix(globalPrefix);

    // 全局管道
    app.useGlobalPipes(ReqValidationPipe);

    // // 全局Filter只能有一个
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter));

    const port = serverConfig[ConfigEnum.APP_PORT] as number;
    await app.listen(port);
}
bootstrap();
