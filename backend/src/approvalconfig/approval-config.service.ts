import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ApprovalConfig } from './approval-config.entity';
import { Users } from '../users/user.entity';
import { Business } from '../business/business.entity';
import { ApprovalConfigBusiness } from './approval-config-business.entity';
import { CreateApprovalConfigDto } from './dto/create-approval-config.dto';

@Injectable()
export class ApprovalConfigService {
  constructor(
    @InjectRepository(ApprovalConfig)
    private readonly approvalRepo: Repository<ApprovalConfig>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,

    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,

    @InjectRepository(ApprovalConfigBusiness)
    private readonly approvalConfigBusinessRepo: Repository<ApprovalConfigBusiness>,
  ) {}

  // ✅ Create new Approval Config + optional business mappings
  async create(dto: CreateApprovalConfigDto): Promise<ApprovalConfig> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const config = this.approvalRepo.create({
      user,
      approvalLevel: dto.approvalLevel,
      minAmount: dto.minAmount,
      maxAmount: dto.maxAmount,
      autoApprove: dto.autoApprove ?? false,
      isActive: dto.isActive ?? true,
    });

    const savedConfig = await this.approvalRepo.save(config);

    // ✅ Optional: link businesses
    if (dto.businessIds && dto.businessIds.length > 0) {
      const businesses = await this.businessRepo.find({
        where: { id: In(dto.businessIds) },
      });

      const mappings = businesses.map((b) =>
        this.approvalConfigBusinessRepo.create({
          approvalConfig: savedConfig,
          business: b,
        }),
      );

      await this.approvalConfigBusinessRepo.save(mappings);
      savedConfig.businessMappings = mappings;
    }

    return savedConfig;
  }

  // ✅ Get all configs with their business mappings
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    items: ApprovalConfig[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [items, total] = await this.approvalRepo.findAndCount({
      relations: ['user', 'businessMappings', 'businessMappings.business'],
      order: { approvalLevel: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

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
      relations: ['user', 'businessMappings', 'businessMappings.business'],
    });
    if (!config) throw new NotFoundException('Approval config not found');
    return config;
  }

  // ✅ Update Approval Config + re-map businesses
  async update(
    id: number,
    dto: CreateApprovalConfigDto,
  ): Promise<ApprovalConfig> {
    const config = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException('User not found');
      config.user = user;
    }

    Object.assign(config, dto);
    const updated = await this.approvalRepo.save(config);

    // ✅ Update business mappings
    if (dto.businessIds) {
      await this.approvalConfigBusinessRepo.delete({
        approvalConfig: { id: updated.id },
      });

      if (dto.businessIds.length > 0) {
        const businesses = await this.businessRepo.find({
          where: { id: In(dto.businessIds) },
        });

        const newMappings = businesses.map((b) =>
          this.approvalConfigBusinessRepo.create({
            approvalConfig: updated,
            business: b,
          }),
        );

        await this.approvalConfigBusinessRepo.save(newMappings);
        updated.businessMappings = newMappings;
      } else {
        updated.businessMappings = [];
      }
    }

    return updated;
  }

  // ✅ Delete
  async remove(id: number): Promise<void> {
    const result = await this.approvalRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Approval config not found');
  }
}
