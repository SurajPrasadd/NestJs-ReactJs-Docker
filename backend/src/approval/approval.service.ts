import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Approval } from '../approval/approval.entity';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { UpdateApprovalStatusDto } from './dto/update-approval-status.dto';
import { GetApprovalsQueryDto } from './dto/query-approval.dto';
import { PurchaseRequestItem } from '../pr/purchase-request-item.entity';
import { PR_STATUS } from '../common/constants/app.constants';

@Injectable()
export class ApprovalService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,

    @InjectRepository(Approval)
    private readonly approvalRepo: Repository<Approval>,

    @InjectRepository(PurchaseRequestItem)
    private readonly prItemRepo: Repository<PurchaseRequestItem>,
  ) {}

  async getAllApprovals(query: GetApprovalsQueryDto) {
    const {
      search,
      status,
      approvedBy,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 10,
    } = query;

    const qb = this.approvalRepo
      .createQueryBuilder('approval')
      .leftJoinAndSelect('approval.purchaseRequestItem', 'item')
      .leftJoinAndSelect('item.purchaseRequest', 'pr')
      .leftJoinAndSelect('item.businessProduct', 'businessProduct')
      .leftJoinAndSelect('businessProduct.product', 'items');

    // 🔍 Search filter: PR number or remarks
    if (search) {
      qb.andWhere('(pr.prNumber ILIKE :search OR pr.remarks ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // 🔹 Filter by approval status / PR status / item status
    if (status) {
      qb.andWhere('(approval.status = :status)', { status });
    }

    // 🔹 Optional: filter by approvedBy userId
    if (approvedBy) {
      qb.andWhere('approval.approvedBy = :approvedBy', { approvedBy });
    }

    qb.orderBy(`approval.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [approvals, total] = await qb.getManyAndCount();

    return {
      total,
      page,
      limit,
      approvals,
    };
  }

  /**
   * 🔎 Fetch single approval with full details
   */
  async findOne(id: number) {
    const approval = await this.approvalRepo.findOne({
      where: { id },
      relations: [
        'approvedBy',
        'purchaseRequestItem',
        'purchaseRequestItem.purchaseRequest',
        'purchaseRequestItem.businessProduct',
        'purchaseRequestItem.businessProduct.product',
      ],
    });

    if (!approval) throw new NotFoundException('Approval not found');

    return {
      ...approval,
      groupName:
        approval.purchaseRequestItem?.businessProduct?.groupName ?? null,
    };
  }

  /**
   * ✅ Approve or reject one or multiple approvals
   */
  async approveOrReject(dto: UpdateApprovalStatusDto, userId: number) {
    const { status, approvalIds, comments } = dto;

    if (!approvalIds || approvalIds.length === 0) {
      throw new BadRequestException('approvalIds are required');
    }

    // 1️⃣ Fetch approvals
    const approvals = await this.approvalRepo.find({
      where: { id: In(approvalIds), isActive: true },
      relations: [
        'purchaseRequestItem',
        'purchaseRequestItem.purchaseRequest',
        'approvedBy',
      ],
    });

    if (approvals.length === 0) {
      throw new NotFoundException('No approvals found for given IDs');
    }

    // 2️⃣ AUTHORIZE: user can approve only their assigned approvals
    approvals.forEach((a) => {
      if (a.approvedBy?.id !== userId) {
        throw new ForbiddenException(
          `You are not allowed to act on approval ID ${a.id}`,
        );
      }
    });

    // 3️⃣ Update each approval + corresponding PR item
    for (const approval of approvals) {
      approval.status = status;
      approval.comments = comments || approval.comments;
      await this.approvalRepo.save(approval);

      const prItem = approval.purchaseRequestItem;
      if (!prItem) continue;

      // Save reference to PR for final update
      let purchaseRequest = prItem.purchaseRequest;

      prItem.status = status;
      prItem.comment = comments || prItem.comment;
      await this.prItemRepo.save(prItem);

      // 4️⃣ If no PR found, skip final status update
      if (!purchaseRequest) continue;

      // 5️⃣ Fetch ALL items of this Purchase Request
      const requestItems = await this.prItemRepo.find({
        where: {
          purchaseRequest: { id: purchaseRequest.id },
        },
      });
      // Determine PR final status
      let finalStatus = PR_STATUS.PENDING;

      // 🔹 Priority order: APPROVED > PARTIALLY_APPROVED > REJECTED > PENDING
      const allApproved = requestItems.every(
        (i) => i.status === PR_STATUS.APPROVED,
      );
      const anyApproved = requestItems.some(
        (i) => i.status === PR_STATUS.APPROVED,
      );
      const allRejected = requestItems.every(
        (i) => i.status === PR_STATUS.REJECTED,
      );

      if (allApproved) {
        finalStatus = PR_STATUS.APPROVED;
      } else if (anyApproved) {
        finalStatus = PR_STATUS.PARTIALLY_APPROVED;
      } else if (allRejected) {
        finalStatus = PR_STATUS.REJECTED;
      }

      // Save only once
      purchaseRequest.status = finalStatus;
      await this.prRepo.save(purchaseRequest);
    }

    return null;
  }
}
