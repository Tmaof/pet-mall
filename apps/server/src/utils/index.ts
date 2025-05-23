import { FILE_NAME_INVALID_CHARS } from '@/constant/index';
import { ResCodeEnum } from '@/enum';
import { clientJwtParsed, JwtPayloadParsed, userJwtParsed } from '@/modules/jwt/types';
import { ForbiddenException } from '@nestjs/common';

class CommonResponse<DataT> {
    data: DataT;
    message: string;
    code: number;
    success: boolean;
    [key: string]: any;
}

/**
 * 返回接口的通用响应
 */
const getCommonRes = <DataT>(res?:Partial<CommonResponse<DataT>>) => {
    const defaultRes = {
        data: {},
        message: '请求成功',
        code: ResCodeEnum.success,
        success: true,
    };

    const result = Object.assign(defaultRes, res);
    if (result.success === false && !result.code) {
        result.code = ResCodeEnum.fail;
    }
    return result;
};


export { getCommonRes };


/**
 * 传入一个对象，将对象第一层的属性值全部转为json字符串。
 * 如果不能转为json字符串，则将属性值设置为空字符串。
 * @param obj 传入的对象
 * @param ignoreKeys 忽略的属性
 */
export const objToJsonStr = <T, ExcludeKeys extends keyof T = never>(obj: T, ignoreKeys:(ExcludeKeys)[]): (
    {[K in keyof T as K extends ExcludeKeys  ? never : K]:string;}
    &
    {[K in keyof T as K extends ExcludeKeys ? K : never]:T[K];}
) => {
    const newObj = {} as any;
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (ignoreKeys.includes(key as any)) {
            newObj[key] = obj[key];
            continue;
        }
        try {
            newObj[key] = JSON.stringify(obj[key]);
        } catch (_e) {
            // eslint-disable-next-line quotes
            newObj[key] = "";
        }
    }
    return newObj;
};


/**
 * 定义上传文件的文件名
 * @param file 上传的文件
 * @returns 文件名
 */
export function getUploadFilename (file:Express.Multer.File) {
    // 年-月-日_时-分-秒-毫秒_文件名
    const date = new Date();
    const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}_${file.originalname}`;
    // 文件名不能包含特殊字符
    return filename.replace(FILE_NAME_INVALID_CHARS, '');
}

/**
 * 从长文本中提取匹配关键词的上下文
 * @param text 原文本
 * @param keyword 关键词
 * @param contextLength 上下文长度(单侧)
 * @returns 提取的上下文
 */
export function extractMatchContext (
    text: string,
    keyword: string,
    contextLength = 10,
): string {
    const index = text.indexOf(keyword);
    if (index === -1) return text;

    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + keyword.length + contextLength);
    let result = text.slice(start, end);

    if (start > 0) result = `...${result}`;
    if (end < text.length) result = `${result}...`;

    return result;
}


/**
 * 从请求req中获取token的原信息。
 * 如果没有token，抛出异常。
 *
 * 是客户登录，且token中没有clientId，抛出异常。
 * @param req
 * @returns
 */
export function getClientInfoOfReq (request) {
    const info = request.user as JwtPayloadParsed;
    if (!info) {
        throw new ForbiddenException('未登录');
    }
    if ('clientId' in info) {
        return info as clientJwtParsed;
    }
    throw new ForbiddenException('非客户登录');
}

/**
 * 从请求req中获取token的原信息。
 * 如果没有token，抛出异常。
 * 是员工登录，且token中没有userId，抛出异常。
 * @param req
 * @returns
 */
export function getUserInfoOfReq (request) {
    const info = request.user as JwtPayloadParsed;
    if (!info) {
        throw new ForbiddenException('未登录');
    }
    if ('userId' in info) {
        return info as userJwtParsed;
    }
    throw new ForbiddenException('非员工登录');
}
