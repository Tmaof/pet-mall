export type PermissionInfo = {
    name: string;
    code: string;
    desc?: string;
    children?: PermissionTree;
};
type PermissionTree = {
    [key: string]: PermissionInfo;
};
export declare const permTree: {
    userPublic: {
        name: string;
        code: string;
    };
    permManage: {
        name: string;
        code: string;
        children: {
            userList: {
                name: string;
                code: string;
                children: {
                    excelImport: {
                        name: string;
                        code: string;
                    };
                    deleteUser: {
                        name: string;
                        code: string;
                    };
                    assignRole: {
                        name: string;
                        code: string;
                    };
                };
            };
            roleList: {
                name: string;
                code: string;
                children: {
                    addRole: {
                        name: string;
                        code: string;
                    };
                    deleteRole: {
                        name: string;
                        code: string;
                    };
                    assignPerm: {
                        name: string;
                        code: string;
                    };
                };
            };
            menuList: {
                name: string;
                code: string;
                children: {
                    addPerm: {
                        name: string;
                        code: string;
                        desc: string;
                    };
                    addRootPerm: {
                        name: string;
                        code: string;
                        desc: string;
                    };
                    addChildrenPerm: {
                        name: string;
                        code: string;
                        desc: string;
                    };
                    deletePerm: {
                        name: string;
                        code: string;
                    };
                };
            };
        };
    };
    clientManage: {
        name: string;
        code: string;
    };
    logManage: {
        name: string;
        code: string;
        children: {
            userLog: {
                name: string;
                code: string;
                children: {
                    deleteUserLog: {
                        name: string;
                        code: string;
                    };
                };
            };
        };
    };
};
export {};
