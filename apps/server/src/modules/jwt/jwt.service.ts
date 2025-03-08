import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class MyJwtService {
    constructor (private jwtService: NestJwtService) {}

    /** 生成token */
    async signAsync (payload: any) {
        return this.jwtService.signAsync(payload);
    }

    /** 验证token */
    async verifyAsync (token: string) {
        return this.jwtService.verifyAsync(token);
    }

    /** 解码token */
    async decode (token: string) {
        return this.jwtService.decode(token);
    }
}
