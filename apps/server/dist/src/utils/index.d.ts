import { ResCodeEnum } from '@/enum';
declare class CommonResponse<DataT> {
    data: DataT;
    message: string;
    code: number;
    success: boolean;
    [key: string]: any;
}
declare const getCommonRes: <DataT>(res?: Partial<CommonResponse<DataT>>) => {
    data: {};
    message: string;
    code: ResCodeEnum;
    success: boolean;
} & Partial<CommonResponse<DataT>>;
export { getCommonRes };
export declare const objToJsonStr: <T, ExcludeKeys extends keyof T = never>(obj: T, ignoreKeys: (ExcludeKeys)[]) => ({ [K in keyof T as K extends ExcludeKeys ? never : K]: string; } & { [K in keyof T as K extends ExcludeKeys ? K : never]: T[K]; });
