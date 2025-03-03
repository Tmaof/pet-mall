export type JwtPayloadInfo = {
    username: string;
    id: number;
};
export type JwtPayloadParsed = {
    token: string;
    username: string;
    userId: number;
};
