import { PermissionTypeEnum } from '../enum';
export declare class CreatePermissionDto {
    code: string;
    name: string;
    pid?: number;
    type: PermissionTypeEnum;
}
