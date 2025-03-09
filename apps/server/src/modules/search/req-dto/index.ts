import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SearchSuggestReqDto {
    @IsNotEmpty({ message: '搜索关键词不能为空' })
    @IsString({ message: '搜索关键词必须是字符串' })
    @Length(1, 50, { message: '搜索关键词长度必须在1-50个字符之间' })
        keyword: string;
}
