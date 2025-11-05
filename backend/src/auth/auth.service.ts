import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  MESSAGES,
  ROLES,
  RESPONSE_CODE,
  VENDOR,
} from '../common/constants/app.constants';
import { ResponseUtil } from '../common/utils/response.util';
import { Users } from 'src/users/user.entity';
import { Session } from './session.entity';
import { v4 as uuidv4 } from 'uuid';
import { Business } from 'src/business/business.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.authRepo.findUserByEmail(dto.email);
    if (existingUser) {
      return ResponseUtil.error(
        MESSAGES.USER.USER_ALREADY_EXISTS,
        RESPONSE_CODE.BAD_REQUEST,
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    type RoleType = (typeof ROLES)[number];

    const normalizedInput = dto.role.trim().toLowerCase();
    if (ROLES.includes(normalizedInput as RoleType)) {
      let existingBusiness: Business | null = null;

      if (dto.role === VENDOR && dto.businessName?.trim()) {
        existingBusiness = await this.authRepo.fineOneBusiness(
          dto.businessName,
        );
      }

      if (
        existingBusiness == null &&
        dto.businessName?.trim() &&
        dto.businessEmail?.trim() &&
        dto.businessPhone?.trim() &&
        dto.businessAddress?.trim()
      ) {
        // Create business first
        existingBusiness = await this.authRepo.creatBusiness({
          businessName: dto.businessName,
          businessEmail: dto.businessEmail,
          businessPhone: dto.businessPhone,
          businessAddress: dto.businessAddress,
        });
      }

      const userDetails = {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role,
        designation: dto.designation,
      };
      let newUser: Users;

      // Create user with business reference
      newUser = await this.authRepo.createUser({
        ...userDetails,
        business: existingBusiness,
      });

      const contactDetails = await this.authRepo.createUserContact({
        users: newUser,
        phone: dto.phone,
        department: dto.department,
      });

      // Generate access token
      const token = await this.createSession(newUser);

      return ResponseUtil.success(MESSAGES.USER.REGISTER_SUCCESS, {
        user: {
          ...newUser,
          contact: {
            phone: contactDetails.phone,
            department: contactDetails.department,
          },
        },
        token,
      });
    } else {
      return ResponseUtil.error(
        MESSAGES.USER.INVALID_ROLE,
        RESPONSE_CODE.BAD_REQUEST,
      );
    }
  }

  async login(dto: LoginDto) {
    const existingUser = await this.authRepo.findUserByEmail(dto.email);
    if (!existingUser) {
      return ResponseUtil.error(
        MESSAGES.USER.NOT_FOUND,
        RESPONSE_CODE.BAD_REQUEST,
      );
    }

    const valid = await bcrypt.compare(dto.password, existingUser.passwordHash);
    if (!valid) {
      return ResponseUtil.error(
        MESSAGES.USER.NVALID_PASSWORD,
        RESPONSE_CODE.BAD_REQUEST,
      );
    }

    const token = await this.createSession(existingUser);

    return ResponseUtil.success(MESSAGES.USER.REGISTER_SUCCESS, {
      existingUser,
      token,
    });
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>(
          'JWT_REFRESH_TOKEN_SECRET',
          'replace_with_another_strong_secret',
        ),
      }) as { sub: string; exp: string };
      // verify session
      const valid = await this.authRepo.findSession(payload.sub);
      if (!valid) {
        return ResponseUtil.error(
          MESSAGES.SESSION.INVALID,
          RESPONSE_CODE.BAD_REQUEST,
        );
      }

      if (!valid.user) {
        return ResponseUtil.error(
          MESSAGES.USER.NOT_FOUND,
          RESPONSE_CODE.BAD_REQUEST,
        );
      }

      const token = await this.createSession(valid.user);

      return ResponseUtil.success(MESSAGES.SESSION.CREATED, token);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        // Attempt to decode the expired token to extract session id (sub)
        const decoded = this.jwtService.decode(refreshToken) as {
          sub?: string;
        };

        if (decoded?.sub) {
          // Revoke expired session
          await this.authRepo.revokeSession(decoded.sub);
        }

        // Refresh token expired
        return ResponseUtil.error(
          MESSAGES.AUTH.TOKEN_EXPIRED,
          RESPONSE_CODE.UNAUTHORIZED,
        );
      }

      return ResponseUtil.error(
        MESSAGES.AUTH.UNAUTHORIZED,
        RESPONSE_CODE.UNAUTHORIZED,
      );
    }
  }

  private async createSession(existingUser: Users) {
    // create session
    const refreshTokenExpiresIn = this.config.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '900s',
    );
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + this.parseExpiryToMs(refreshTokenExpiresIn),
    );

    const sessionId = uuidv4();

    const session: Session = await this.authRepo.createSession(
      sessionId,
      existingUser.id,
      expiresAt,
    );

    // generate tokens
    const accessToken = await this.generateAccessToken(
      sessionId,
      refreshTokenExpiresIn,
    );
    const refreshToken = await this.generateRefreshToken(sessionId);

    // store hashed refresh token with session
    const hashrefreshToken = await bcrypt.hash(refreshToken, 10);

    session.user = existingUser;
    session.revoked = false;
    session.refreshTokenHash = hashrefreshToken;
    await this.authRepo.saveSession(session);

    return { accessToken, refreshToken, expiresAt };
  }

  private async generateAccessToken(sessionid: string, expiresIn: string) {
    const secret = this.config.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
      'replace_with_strong_secret',
    );
    const payload = { sub: sessionid };
    return this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: (expiresIn || '900s') as any,
    });
  }

  private async generateRefreshToken(sessionid: string) {
    const secretRefresh = this.config.get<string>(
      'JWT_REFRESH_TOKEN_SECRET',
      'replace_with_another_strong_secret',
    );
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const payload = { sub: sessionid };
    return this.jwtService.signAsync(payload, {
      secret: secretRefresh,
      expiresIn: (expiresIn || '7d') as any,
    });
  }

  // helper: parse values like '7d', '15m', '900s'
  private parseExpiryToMs(exp: string) {
    // supports number + (s|m|h|d)
    const match = /^(\d+)(s|m|h|d)?$/.exec(exp);
    if (!match) return 0;
    const value = Number(match[1]);
    const unit = match[2] || 's';
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value * 1000;
    }
  }
}
