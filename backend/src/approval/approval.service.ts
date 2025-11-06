import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Approval } from '../approval/approval.entity';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { UpdateApprovalStatusDto } from './dto/update-approval-status.dto';
import { GetApprovalsQueryDto } from './dto/query-approval.dto';
import { PurchaseRequestItem } from '../pr/purchase-request-item.entity';

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
      .leftJoinAndSelect('approval.approvedBy', 'user')
      .leftJoinAndSelect('approval.purchaseRequest', 'pr')
      .leftJoinAndSelect('pr.items', 'items');

    // 🔍 Search filter: PR number or remarks
    if (search) {
      qb.andWhere('(pr.prNumber ILIKE :search OR pr.remarks ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    // 🔹 Filter by approval status / PR status / item status
    if (status) {
      qb.andWhere(
        '(approval.status = :status OR pr.status = :status OR items.status = :status)',
        { status },
      );
    }

    // 🔹 Optional: filter by approvedBy userId
    if (approvedBy) {
      qb.andWhere('approval.approvedBy = :approvedBy', { approvedBy });
    }

    qb.orderBy(`approval.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [approvals, total] = await qb.getManyAndCount();

    // 🧾 Response formatting
    const data = approvals.map((a) => ({
      approvalId: a.id,
      approvalLevel: a.approvalLevel,
      approvalStatus: a.status,
      approvedBy: a.approvedBy
        ? {
            id: a.approvedBy.id,
            name: a.approvedBy.name,
            email: a.approvedBy.email,
          }
        : null,
      prNumber: a.purchaseRequest?.prNumber,
      prStatus: a.purchaseRequest?.status,
      remarks: a.purchaseRequest?.remarks,
      items: a.purchaseRequest?.items || [],
      createdAt: a.createdAt,
    }));

    return {
      total,
      page,
      limit,
      data,
    };
  }

  /**
   * 🔎 Fetch single approval with full details
   */
  async findOne(id: number) {
    const approval = await this.approvalRepo.findOne({
      where: { id },
      relations: ['approvedBy', 'purchaseRequest', 'purchaseRequest.items'],
    });

    if (!approval) throw new NotFoundException('Approval not found');

    return {
      ...approval,
      groupName: approval.purchaseRequest?.groupName ?? null,
    };
  }

  /**
   * ✅ Approve or reject one or multiple approvals
   */
  async approveOrReject(dto: UpdateApprovalStatusDto, userId: number) {
    const { prNumber, status, itemIds, comments } = dto;

    // 1️⃣ Fetch PR with approvals & items
    const pr = await this.prRepo.findOne({
      where: { prNumber },
      relations: ['items', 'approvals', 'approvals.approvedBy'],
    });
    if (!pr)
      throw new NotFoundException(`Purchase Request not found: ${prNumber}`);

    // 2️⃣ Find current user's approval record
    const approval = pr.approvals.find(
      (a) => a.approvedBy?.id === userId && a.isActive,
    );
    if (!approval)
      throw new NotFoundException('Approval record not found for this user');

    // 3️⃣ Determine which items to process
    let itemsToProcess: PurchaseRequestItem[] = [];
    if (itemIds?.length) {
      itemsToProcess = pr.items.filter((i) => itemIds.includes(i.id));
      if (itemsToProcess.length === 0)
        throw new NotFoundException('No matching items found in PR');
    } else {
      itemsToProcess = pr.items;
    }

    // 4️⃣ Update item status & comments
    for (const item of itemsToProcess) {
      item.status = status;
      if (comments) item.comment = comments;
      await this.prItemRepo.save(item);
    }

    // 5️⃣ Update current approval record
    approval.status = status;
    approval.comments = comments ?? null;
    await this.approvalRepo.save(approval);

    // 6️⃣ If current approval is APPROVED → auto-approve lower-level pending ones
    // if (status === 'APPROVED') {
    //   const lowerLevelApprovals = pr.approvals.filter(
    //     (a) =>
    //       a.approvalLevel < approval.approvalLevel && a.status === 'PENDING',
    //   );

    //   for (const low of lowerLevelApprovals) {
    //     low.status = 'APPROVED';
    //     low.comments = 'Auto-approved due to higher-level approval';
    //     await this.approvalRepo.save(low);
    //   }
    // }

    // 7️⃣ Recalculate PR status based on all items
    const allApproved = pr.items.every((i) => i.status === 'APPROVED');
    const allRejected = pr.items.every((i) => i.status === 'REJECTED');
    const someApproved = pr.items.some((i) => i.status === 'APPROVED');

    if (allRejected) pr.status = 'REJECTED';
    else if (allApproved) pr.status = 'APPROVED';
    else if (someApproved) pr.status = 'PARTIALLY_APPROVED';
    else pr.status = 'PENDING';

    await this.prRepo.save(pr);

    return {
      message:
        itemsToProcess.length === pr.items.length
          ? `All items ${status.toLowerCase()} successfully`
          : `Selected items ${status.toLowerCase()} successfully`,
      prNumber: pr.prNumber,
      prStatus: pr.status,
      approvalLevel: approval.approvalLevel,
      approvalStatus: approval.status,
    };
  }
}
