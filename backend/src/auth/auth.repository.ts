// src/modules/auth/auth.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { Business } from '../business/business.entity';
import { Contact } from '../business/contract.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Users) private readonly userRepo: Repository<Users>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async findUserByEmail(email: string): Promise<Users | null> {
    return this.userRepo.findOne({
      where: { email, isActive: true },
      relations: ['contact'],
    });
  }

  async createUser(userData: Partial<Users>): Promise<Users> {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }

  async fineOneBusiness(businessName: string): Promise<Business | null> {
    // Check if business already exists by name
    return this.businessRepo.findOne({
      where: { businessName, isActive: true },
    });
  }

  async creatBusiness(business: Partial<Business>): Promise<Business> {
    // Check if business already exists by name
    const existingBusiness = await this.businessRepo.findOne({
      where: { businessName: business.businessName, isActive: true },
    });

    if (existingBusiness) {
      // If found, return the existing one
      return existingBusiness;
    }

    // If not found, create a new business
    const newBusiness = this.businessRepo.create(business);
    return await this.businessRepo.save(newBusiness);
  }

  async createUserContact(contactData: Partial<Contact>): Promise<Contact> {
    const contact = this.contactRepo.create(contactData);
    return await this.contactRepo.save(contact);
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
