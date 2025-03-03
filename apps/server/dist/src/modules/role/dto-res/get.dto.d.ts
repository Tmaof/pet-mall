declare class GetRoleListItem {
    id: number;
    name: string;
    describe: string;
    permissions: number[];
    names: string[];
}
export type GetRoleListDto = Array<GetRoleListItem>;
export declare class GetRolePermissionsListItem {
    id: number;
    pid: number;
    type: number;
    name: string;
    code: string;
    select: number;
    children: GetRolePermissionsListItem[];
}
export declare class GetRolePermissionsDto {
    list: GetRolePermissionsListItem[];
    selected: number[];
}
export {};
