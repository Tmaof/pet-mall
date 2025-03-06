import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { unlink, existsSync } from 'fs';
import { promisify } from 'util';
import { uploadDir, staticPrefix } from 'config';
import { UploadFilesResDto } from './res-dto/res-dto';
const unlinkAsync = promisify(unlink);


@Injectable()
export class UploadService {
    /**
     * 上传多个文件
     * @param files 文件对象数组
     */
    async uploadFiles (files: Express.Multer.File[]): Promise<UploadFilesResDto> {
        const result: UploadFilesResDto = {
            errFiles: [],
            succMap: {},
        };

        await Promise.all(files.map(async (file) => {
            try {
                // 校验
                const { size, originalname } = file;
                const num = 20;
                if (size > num * 1024 * 1024) {
                    throw new Error(`文件大小超过${num}MB`);
                }
                // if (!mimetype.startsWith('image/')) {
                //     throw new Error('文件类型不支持');
                // }

                // 保存成功的文件
                result.succMap[originalname] = join(staticPrefix, file.filename);
            } catch (error) {
                // 记录失败的文件
                result.errFiles.push(file.originalname);
                // 删除失败的文件
                await unlinkAsync(file.path);
            }
        }));

        return result;
    }

    /**
     * 删除文件
     * @param url 文件URL
     */
    async deleteFile (url: string): Promise<void> {
        const filename = url.split('/').pop();
        if (!filename) {
            throw new Error('无效的文件URL');
        }

        const filepath = join(uploadDir, filename);
        if (existsSync(filepath)) {
            try {
                await unlinkAsync(filepath);
            } catch (error) {
                throw new Error('删除文件失败');
            }
        } else {
            throw new Error('文件不存在');
        }
    }
}
