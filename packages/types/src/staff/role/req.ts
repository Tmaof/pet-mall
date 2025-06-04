import { IsString, IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
      name: string;

    @IsString()
      describe?: string;
}

export class UpdateRolePermissionDto {
    @IsNumber()
    @IsNotEmpty()
      roleId: number;

    @IsArray()
    @IsNotEmpty()
      permissionIdList: number[];
}
