declare class CreateUserBatchArg {
    username: string;
    password: string;
    openTime?: Date;
    role?: string;
}
export declare class CreateUserBatchDto {
    payload: CreateUserBatchArg[];
}
export {};
