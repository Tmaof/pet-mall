import { Region } from '../address.entity';
import { RegionItemDto } from '../res-dto';

/**
 * 格式化地区数据，满足响应dto
 * @param region 地区数据
 * @returns 格式化后的地区数据
 */
export const formatRegion = (region: Region): RegionItemDto => {
    return {
        ID: region.ID,
        name: region.name,
        code: region.code,
        fullName: region.fullName,
        regionType: region.regionType,
        children: [],
    };
};
