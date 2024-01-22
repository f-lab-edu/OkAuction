import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-jwt';

export default class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req) => {
        console.log(req.headers.cookie);
        return req.headers.cookie.split('=')[1];
      },
      secretOrKey: 'refreshSecretKey',
    });
  }

  async validate(payload) {
    console.log(payload);
    //const payload = { userId: user.id, sub: user.u_name };
    return {
      id: payload.userId,
      username: payload.sub,
    };
  }
}
