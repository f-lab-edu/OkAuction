import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';

export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
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
