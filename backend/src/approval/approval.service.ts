import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  LessThanOrEqual,
  MoreThanOrEqual,
  IsNull,
  In,
} from 'typeorm';
import { Approval } from '../approval/approval.entity';
import { PurchaseRequest } from 'src/pr/purchase-requests.entity';
import { UpdateApprovalStatusDto } from './dto/update-approval-status.dto';
import { QueryApprovalDto } from './dto/query-approval.dto';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,

    @InjectRepository(Approval)
    private readonly approvalRepo: Repository<Approval>,
  ) {}

  async approveOrReject(dto: UpdateApprovalStatusDto, userId: number) {
    const { approvalIds, status, comments } = dto;

    // 🔹 Fetch all relevant approvals with PR relation
    const approvals = await this.approvalRepo.find({
      where: { id: In(approvalIds) },
      relations: ['purchaseRequest', 'approvedBy'],
    });

    if (approvals.length === 0)
      throw new NotFoundException('No approvals found for given IDs');

    // 🔹 Validate ownership
    const unauthorized = approvals.find((a) => a.approvedBy?.id !== userId);
    if (unauthorized)
      throw new NotFoundException(
        'You are not authorized to approve one or more of these requests',
      );

    // 🔹 Update each approval record
    for (const approval of approvals) {
      approval.status = status;
      approval.comments = comments ?? undefined;
      await this.approvalRepo.save(approval);

      // 🔹 Now recalc status of the related PR after each update
      const relatedApprovals = await this.approvalRepo.find({
        where: { purchaseRequest: { id: approval.purchaseRequest.id } },
        order: { approvalLevel: 'ASC' },
      });

      const hasRejection = relatedApprovals.some(
        (a) => a.status === 'REJECTED',
      );
      const allApproved = relatedApprovals.every(
        (a) => a.status === 'APPROVED',
      );

      if (hasRejection) {
        approval.purchaseRequest.status = 'REJECTED';
      } else if (allApproved) {
        approval.purchaseRequest.status = 'APPROVED';
      } else {
        approval.purchaseRequest.status = 'PENDING';
      }

      await this.prRepo.save(approval.purchaseRequest);
    }

    return {
      message: `Requests ${status.toLowerCase()} successfully`,
    };
  }

  /**
   * Fetch all approvals with optional filters and pagination
   */
  async findAll(queryDto: QueryApprovalDto) {
    const {
      purchaseRequestId,
      approvedBy,
      approvalLevel,
      status,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
    } = queryDto;

    const query = this.approvalRepo
      .createQueryBuilder('approval')
      .leftJoinAndSelect('approval.purchaseRequest', 'purchaseRequest')
      .leftJoinAndSelect('purchaseRequest.requestedBy', 'requestedBy')
      .leftJoinAndSelect('approval.approvedBy', 'approvedByUser');

    // Filters
    if (purchaseRequestId)
      query.andWhere('purchaseRequest.id = :purchaseRequestId', {
        purchaseRequestId,
      });

    if (approvedBy)
      query.andWhere('approvedByUser.id = :approvedBy', { approvedBy });

    if (approvalLevel)
      query.andWhere('approval.approvalLevel = :approvalLevel', {
        approvalLevel,
      });

    if (status) query.andWhere('approval.status = :status', { status });

    if (typeof isActive === 'boolean')
      query.andWhere('approval.isActive = :isActive', { isActive });

    // Pagination
    query.skip((page - 1) * limit).take(limit);

    // Sorting
    const validSortFields = [
      'createdAt',
      'updatedAt',
      'approvalLevel',
      'status',
    ];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`approval.${sortField}`, order);

    const [records, total] = await query.getManyAndCount();

    return {
      data: records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetch a single approval by ID (with full relations)
   */
  async findOne(id: number) {
    const approval = await this.approvalRepo.findOne({
      where: { id },
      relations: [
        'purchaseRequest',
        'purchaseRequest.requestedBy',
        'purchaseRequest.businessProduct',
        'purchaseRequest.businessProduct.product',
        'purchaseRequest.businessProduct.business',
        'approvedBy',
      ],
    });

    if (!approval) throw new NotFoundException('Approval not found');
    return approval;
  }
}
