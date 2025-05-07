import { staticPrefix, uploadDir } from '@/config';
import { getUploadFilename } from '@/utils';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

// 确保上传目录存在
if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
}

@Module({
    imports: [
        // 配置文件上传
        MulterModule.register({
            // dest: uploadDir,
            storage: diskStorage({
                destination: uploadDir,
                filename: (req, file, cb) => {
                    // 解码文件原始名称，防止中文乱码
                    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
                    /** 保存时的文件名 */
                    const filename = getUploadFilename(file);
                    return cb(null, filename);
                },
            }),
        }),
        // 配置静态文件服务
        ServeStaticModule.forRoot({
            rootPath: uploadDir,
            serveRoot: staticPrefix, // 访问路径前缀
            serveStaticOptions: {
                index: false, // 禁止目录浏览
                maxAge: 2592000, // 缓存30天
            },
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}
