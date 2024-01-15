import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { IncorrectPasswordException } from './exceptions/incorrect-password.exception';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    // 사용자 아이디와 비밀번호 검증
    const { u_id, u_password } = loginUserDto;
    const user = await this.usersService.findOneByUId(u_id);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (!(await bcrypt.compare(u_password, user.u_password))) {
      throw new IncorrectPasswordException();
    }
    const userResponse: UserResponseDto = {
      id: user.id,
      u_id: user.u_id,
      u_name: user.u_name,
      u_email: user.u_email,
      u_phone: user.u_phone,
      u_address: user.u_address,
      u_addr_postcode: user.u_addr_postcode,
      u_address_sub: user.u_address_sub,
    };
    return userResponse;
  }

  async login(user: UserResponseDto): Promise<LoginResponseDto> {
    // JWT 토큰 생성
    const payload = { userId: user.u_id, sub: user.u_name };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'secretKey',
        expiresIn: '1h',
      }),
    };
  }
}
