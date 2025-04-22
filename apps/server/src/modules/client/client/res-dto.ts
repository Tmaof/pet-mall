import { Client } from './client.entity';

export class ClientListDto {
    list: Client[];
    total: number;
    page: number;
    pageSize: number;
}
