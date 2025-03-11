import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './address.entity';
import { RegionItemDto, RegionResDto } from './res-dto';
import { formatRegion } from './utils';

@Injectable()
export class AddressService {
    constructor (@InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,) {}

    /**
     * 获取3级行政区划列表：省份、市、县。
     * 注意：只有三级数据有6位编码（code），四级（五级）都是12位编码。
     * 中国的code = 100000。
     */
    async getRegionTree (): Promise<RegionResDto> {
        const china = await this.regionRepository.findOne({ where: { code: '100000' } });
        /** 深度优先搜索 */
        const dfs = async (list: RegionItemDto[], deep: number) => {
            if (deep > 3) {
                return;
            }
            for (const item of list) {
                const children = await this.regionRepository.find({ where: { parentID: item.ID } });
                if (children.length > 0) {
                    const newChildren = children.map(formatRegion);
                    item.children = newChildren;
                    await dfs(newChildren, deep + 1);
                }
            }
        };
        const data = formatRegion(china);
        await dfs([data], 1);
        return { list: data.children };
    }
}
