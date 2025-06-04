import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
    @IsString()
        name: string;

    @IsOptional()
    @IsNumber()
        parentId?: number;

    @IsOptional()
    @IsNumber()
        sortOrder?: number;

    @IsOptional()
    @IsBoolean()
        isVisible?: boolean;
}
