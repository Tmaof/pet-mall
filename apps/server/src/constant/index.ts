
/** 路由是否公开的key */
export const IS_PUBLIC_KEY = 'isPublic';

/** 路由需要的权限代码的key */
export const NEED_PERMISSION_CODE = 'needPermissionCode';

/**
 * 正则 文件名不能包含的特殊字符：
 *   \  /  :  *  ?  "  <  >  |   这些字符，在windows中都有特定含义的，如果做为文件名就会引起歧义。
 * */
export const FILE_NAME_INVALID_CHARS = /[\\/:*?"<>|]/g;
