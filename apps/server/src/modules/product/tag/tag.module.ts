import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Tag])],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService],
})
export class TagModule {}
