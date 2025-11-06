import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from '../auth.repository';
import { MESSAGES } from '../../common/constants/app.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly authRepo: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>(
        'JWT_ACCESS_TOKEN_SECRET',
        'replace_with_strong_secret',
      ),
      passReqToCallback: false,
    });
  }

  async validate(payload: { sub: string; exp: string }) {
    // check session validity
    if (!payload.sub) {
      throw new UnauthorizedException('Session id missing in token');
    }

    const ok = await this.authRepo.findSession(payload.sub);
    if (!ok) {
      throw new UnauthorizedException(MESSAGES.SESSION.INVALID);
    }

    if (!ok.user) {
      throw new UnauthorizedException(MESSAGES.USER.NOT_FOUND);
    }

    // attach minimal user + session info to request.user
    return {
      id: ok.user.id,
      role: ok.user.role,
      name: ok.user.name,
      nagroupNameme: ok.user.groupName,
    };
  }
}
