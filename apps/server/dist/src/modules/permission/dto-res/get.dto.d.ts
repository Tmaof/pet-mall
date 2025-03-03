export declare class GetPermissionListItem {
    id: number;
    pid: number;
    name: string;
    code: string;
    type: number;
    children: GetPermissionListItem[];
}
export type GetPermissionListDto = GetPermissionListItem[];
