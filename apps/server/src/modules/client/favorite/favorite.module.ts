import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Favorite } from './favorite.entity';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';


@Module({
    imports: [TypeOrmModule.forFeature([Favorite])],
    controllers: [FavoriteController],
    providers: [FavoriteService],
    exports: [FavoriteService],
})
export class FavoriteModule {

}
