/**
 * 标签信息响应DTO
 */
export class TagDto {
    /** 标签ID */
    id: number;

    /** 标签名称 */
    name: string;
}

/**
 * 标签列表响应DTO
 */
export class TagListDto {
    /** 标签列表 */
    list: TagDto[];

    /** 总数 */
    total: number;
}
