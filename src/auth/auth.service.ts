import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AuthDTO } from './dto/auth.dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private UserService: UserService,
  ) {}

  async signup(dto: AuthDTO) {
    const hash = await argon.hash(dto.password);
    const user = await this.UserService.createUser({
      email: dto.email,
      username: dto.username,
      hash: hash,
    });
    return user;
  }
}
