import {
    Controller,
    Post,
    Delete,
    UseInterceptors,
    UploadedFiles,
    Query,
    UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '@/guards/jwt.guard';
import { UploadService } from './upload.service';
import { getCommonRes } from '@/utils';

@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
    constructor (private readonly uploadService: UploadService) {}

    /**
     * 上传文件(支持多文件)
     */
    @Post()
    @UseInterceptors(FilesInterceptor('file', 10)) // 最多10个文件
    async uploadFiles (@UploadedFiles() files: Express.Multer.File[]) {
        const data = await this.uploadService.uploadFiles(files);
        return getCommonRes({ data });
    }

    /**
     * 删除文件
     */
    @Delete()
    async deleteFile (@Query('url') url: string) {
        await this.uploadService.deleteFile(url);
        return getCommonRes();
    }
}
