import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalConfig } from './approval-config.entity';
import { ApprovalConfigBusiness } from './approval-config-business.entity';
import { CreateApprovalConfigBusinessDto } from './dto/create-approval-config-business.dto';

@Injectable()
export class ApprovalBSConfigService {
  constructor(
    @InjectRepository(ApprovalConfigBusiness)
    private readonly approvalConfigBusinessRepo: Repository<ApprovalConfigBusiness>,

    @InjectRepository(ApprovalConfig)
    private readonly approvalConfigRepo: Repository<ApprovalConfig>,
  ) {}

  // ✅ Create mapping
  async create(
    dto: CreateApprovalConfigBusinessDto,
  ): Promise<ApprovalConfigBusiness> {
    const config = await this.approvalConfigRepo.findOne({
      where: { id: dto.approvalConfigId },
    });
    if (!config) throw new NotFoundException('Approval config not found');

    const mapping = this.approvalConfigBusinessRepo.create({
      approvalConfig: config,
      groupName: dto.groupName,
    });

    return this.approvalConfigBusinessRepo.save(mapping);
  }

  // ✅ Find all
  async findAll(page = 1, limit = 10) {
    const [items, total] = await this.approvalConfigBusinessRepo.findAndCount({
      relations: ['approvalConfig'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ✅ Find one
  async findOne(id: number): Promise<ApprovalConfigBusiness> {
    const mapping = await this.approvalConfigBusinessRepo.findOne({
      where: { id },
      relations: ['approvalConfig'],
    });
    if (!mapping) throw new NotFoundException('Mapping not found');
    return mapping;
  }

  // ✅ Update mapping
  async update(
    id: number,
    dto: CreateApprovalConfigBusinessDto,
  ): Promise<ApprovalConfigBusiness> {
    const mapping = await this.findOne(id);

    if (dto.approvalConfigId) {
      const config = await this.approvalConfigRepo.findOne({
        where: { id: dto.approvalConfigId },
      });
      if (!config) throw new NotFoundException('Approval config not found');
      mapping.approvalConfig = config;
    }

    if (dto.groupName) {
      mapping.groupName = dto.groupName;
    }

    return this.approvalConfigBusinessRepo.save(mapping);
  }

  // ✅ Delete mapping
  async remove(id: number): Promise<void> {
    const result = await this.approvalConfigBusinessRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Mapping not found');
  }
}
