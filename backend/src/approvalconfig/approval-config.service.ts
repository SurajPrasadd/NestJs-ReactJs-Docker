import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ApprovalConfig } from './approval-config.entity';
import { Users } from '../users/user.entity';
import { Business } from '../business/business.entity';
import { CreateApprovalConfigDto } from './dto/create-approval-config.dto';
import { FilterApprovalConfigDto } from './dto/filter-approval-config.dto';

@Injectable()
export class ApprovalConfigService {
  constructor(
    @InjectRepository(ApprovalConfig)
    private readonly approvalRepo: Repository<ApprovalConfig>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async getUniqueGroupNames(
    search?: string,
    sort: 'ASC' | 'DESC' = 'ASC',
    page = 1,
    limit = 10,
  ) {
    const query = this.approvalRepo
      .createQueryBuilder('ac')
      .select('DISTINCT ac.group_name', 'groupName')
      .where('ac.is_active = true')
      .andWhere('ac.group_name IS NOT NULL');

    if (search) {
      query.andWhere('ac.group_name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    query.orderBy('ac.group_name', sort);

    query.skip((page - 1) * limit).take(limit);
    const rawGroups = await query.getRawMany();
    const groups = rawGroups.map((r) => r.groupName);

    return {
      groups,
      page,
      limit,
      total: groups.length,
    };
  }

  // ✅ Create new Approval Config
  async create(dto: CreateApprovalConfigDto, createdBy: number) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const usercreatedBy = await this.userRepo.findOne({
      where: { id: createdBy },
    });

    // 🔍 CHECK IF SAME CONFIG ALREADY EXISTS
    const existing = await this.approvalRepo.findOne({
      where: {
        user: { id: dto.userId },
        approvalLevel: dto.approvalLevel,
        minAmount: dto.minAmount,
        maxAmount: dto.maxAmount,
        groupName: dto.groupName,
      },
    });

    // 🔁 If already exists → return existing and stop
    if (existing) throw new Error('Approval already configured.');

    const config = this.approvalRepo.create({
      user,
      approvalLevel: dto.approvalLevel,
      minAmount: dto.minAmount,
      maxAmount: dto.maxAmount,
      groupName: dto.groupName,
      craetedBy: usercreatedBy,
      autoApprove: dto.autoApprove ?? false,
      isActive: dto.isActive ?? true,
    });

    await this.approvalRepo.save(config);

    return null;
  }

  // ✅ Get all configs with their business mappings
  async findAll(query: FilterApprovalConfigDto) {
    const {
      page = 1,
      limit = 10,
      search,
      groupName,
      userId,
      createdById,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const qb = this.approvalRepo
      .createQueryBuilder('ac')
      .leftJoinAndSelect('ac.user', 'u')
      .skip((page - 1) * limit)
      .take(limit);

    // 🔍 Search (username or email)
    if (search) {
      qb.andWhere(
        `(LOWER(u.name) LIKE LOWER(:search) 
    OR LOWER(u.email) LIKE LOWER(:search))`,
        { search: `%${search}%` },
      );
    }

    // 🎯 Filter by group name
    if (groupName) {
      qb.andWhere('ac.groupName = :groupName', { groupName });
    }

    // 🎯 Filter by user
    if (userId) {
      qb.andWhere('u.id = :userId', { userId });
    }

    // 🎯 Filter by createdBy
    if (createdById) {
      qb.andWhere('ac.created_by = :createdById', { createdById });
    }

    // 🎯 Filter by active status
    if (typeof isActive === 'boolean') {
      qb.andWhere('ac.isActive = :isActive', { isActive });
    }

    // 🏆 Allowed sort fields
    const allowedSortFields = [
      'approvalLevel',
      'minAmount',
      'maxAmount',
      'createdAt',
      'updatedAt',
    ];

    const sortField = allowedSortFields.includes(sortBy)
      ? `ac.${sortBy}`
      : 'ac.createdAt';

    qb.orderBy(sortField, sortOrder);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ✅ Get single approval config
  async findOne(id: number): Promise<ApprovalConfig> {
    const config = await this.approvalRepo.findOne({
      where: { id },
      relations: ['user', 'user.contact', 'craetedBy', 'craetedBy.business'],
    });
    if (!config) throw new NotFoundException('Approval config not found');
    return config;
  }

  // ✅ Update Approval Config + re-map businesses
  async update(id: number, dto: CreateApprovalConfigDto, createdBy: number) {
    const config = await this.findOne(id);
    if (!config) throw new NotFoundException('Config not found');

    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Assigned user not found');

    const usercreatedBy = await this.userRepo.findOne({
      where: { id: createdBy },
    });

    config.user = user;
    config.craetedBy = usercreatedBy;
    config.approvalLevel = dto.approvalLevel ?? config.approvalLevel;
    config.minAmount = dto.minAmount ?? config.minAmount;
    config.maxAmount = dto.maxAmount ?? config.maxAmount;
    config.groupName = dto.groupName ?? config.groupName;
    config.autoApprove = dto.autoApprove ?? config.autoApprove;
    config.isActive = dto.isActive ?? config.isActive;

    await this.approvalRepo.save(config);

    return null;
  }

  // ✅ Delete
  async remove(id: number): Promise<void> {
    const result = await this.approvalRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Approval config not found');
  }
}
