import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

/**
 * 销售分析请求参数
 */
export class SalesAnalysisReqDto {
    /**
     * 开始时间
     * @example '2024-03-01'
     */
    @IsOptional()
    @IsDate()
    @Type(() => Date)
        startTime?: Date;

    /**
     * 结束时间
     * @example '2024-03-04'
     */
    @IsOptional()
    @IsDate()
    @Type(() => Date)
        endTime?: Date;
}
