import type { Client } from 'server-modules/client/client/client.entity';
export type { Client } from 'server-modules/client/client/client.entity';

export class ClientListDto {
  list: Client[];
  total: number;
  page: number;
  pageSize: number;
}
