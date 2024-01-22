import { Controller, Post, Body, UseGuards, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { LoginResponseDto } from './dto/login-response.dto';
import Ipayload from './interface/Ipayload';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res() res: Response,
  ): Promise<void> {
    // 사용자 검증
    const user = await this.authService.validateUser(loginUserDto);
    // 로그인 성공시 JWT 토큰 반환
    const loginResponse: LoginResponseDto = await this.authService.login(
      user,
      res,
    );
    res.json(loginResponse);
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  refreshAccessToken(@CurrentUser() user: Ipayload): string {
    return this.authService.restoreAccessToken(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('fetch')
  fetchOne(@CurrentUser() user: Ipayload): Promise<UserResponseDto> {
    console.log(user);
    return this.usersService.fetchOne(user.userId);
  }
}
