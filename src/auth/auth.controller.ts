import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    // 사용자 검증
    const user = await this.authService.validateUser(loginUserDto);
    // 로그인 성공시 JWT 토큰 반환
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('fetch')
  fetchOne(@CurrentUser() user): Promise<UserResponseDto> {
    console.log(user);
    return this.usersService.fetchOne(user.id);
  }
}
