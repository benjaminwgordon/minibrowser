import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthDTO } from '../../dist/auth/dto/auth.dto';
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    async signup(dto: AuthDTO){
        const hash = await 
    }
}
