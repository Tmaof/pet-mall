
/** jwt 负载 */
export type JwtPayloadInfo = ClientJwtPayloadInfo | UserJwtPayloadInfo;

/** 客户 jwt 负载 */
export type ClientJwtPayloadInfo = {
    clientname:string;

    clientId:number;
}

/** 员工 jwt 负载 */
export type UserJwtPayloadInfo = {
    username:string;

    userId:number;
}

export type JwtPayloadParsedKey = keyof userJwtParsed | keyof clientJwtParsed;

/** jwt 负载 解析后，添加到 请求对象 req 中  */
export type JwtPayloadParsed = userJwtParsed | clientJwtParsed;

/** 员工 jwt 负载 解析后，添加到 请求对象 req 中的格式  */
export type userJwtParsed = {
    token: string;

    /** 员工用户名 */
    username:string;

    /** 员工ID */
    userId:number;
}

/** 客户 jwt 负载 解析后，添加到 请求对象 req 中的格式  */
export type clientJwtParsed = {
    token: string;

    /** 客户用户名 */
    clientname:string;

    /** 客户ID */
    clientId:number;
}
