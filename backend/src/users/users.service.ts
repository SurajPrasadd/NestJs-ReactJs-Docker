import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly repo: Repository<Users>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  create(data: Partial<Users>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }
}
