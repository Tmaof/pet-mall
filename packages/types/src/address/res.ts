
export class RegionItemDto {
  ID: number;
  name: string;
  code: string;
  fullName: string;
  regionType: number;
  children: RegionItemDto[];
}

export class RegionResDto {
  list: RegionItemDto[];
}
