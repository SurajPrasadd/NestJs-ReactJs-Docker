// src/modules/auth/auth.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
  ) {}

  async findUserByEmail(email: string): Promise<Users | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async createUser(userData: Partial<Users>): Promise<Users> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async createSession(
    sessionid: string,
    userId: number,
    expiresAt?: Date,
  ): Promise<Session> {
    const session = this.sessionRepo.create({
      sessionid,
      userId,
      expiresAt,
    });

    return this.sessionRepo.save(session);
  }

  async saveSession(session: Session): Promise<Session> {
    return this.sessionRepo.save(session);
  }

  async findSession(sessionid: string): Promise<Session | null> {
    return this.sessionRepo.findOne({
      where: { sessionid, revoked: false },
      relations: ['user'], // <-- this loads the associated user
    });
  }

  async revokeSession(sessionid: string): Promise<Session | null> {
    const session = await this.sessionRepo.findOne({ where: { sessionid } });
    if (!session) return null;

    session.revoked = true;
    return this.sessionRepo.save(session);
  }

  async deleteSession(sessionid: string): Promise<void> {
    await this.sessionRepo.delete({ sessionid });
  }
}
