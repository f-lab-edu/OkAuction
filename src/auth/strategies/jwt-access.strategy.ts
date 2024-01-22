import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy, ExtractJwt } from 'passport-jwt';
import Ipayload from '../interface/Ipayload';

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

  async validate(payload: Ipayload): Promise<Ipayload> {
    console.log(payload);
    //const payload = { userId: user.id, sub: user.u_name };
    return payload;
  }
}
