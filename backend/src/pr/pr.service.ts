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
import { CartItem } from '../cart/cart-item.entity';
import { Users } from '../users/user.entity';
import { PurchaseRequest } from './purchase-requests.entity';
import { QueryPurchaseRequestDto } from './dto/query-purchase-request.dto';
import { ApprovalConfig } from 'src/approvalconfig/approval-config.entity';

@Injectable()
export class PRService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,

    @InjectRepository(Approval)
    private readonly approvalRepo: Repository<Approval>,

    @InjectRepository(ApprovalConfig)
    private readonly configRepo: Repository<ApprovalConfig>,

    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  /**
   * ✅ Create Purchase Requests for all items in a user's cart
   */
  async createPurchaseRequestsFromCart(
    user: Users,
  ): Promise<PurchaseRequest[]> {
    // 🛒 1. Get user's cart items
    const cartItems = await this.cartRepo.find({
      where: { users: { id: user.id } },
      relations: [
        'businessProduct',
        'businessProduct.product',
        'businessProduct.business',
      ],
    });

    if (cartItems.length === 0)
      throw new BadRequestException('Cart is empty — nothing to submit');

    let prNumber = `PR-${Date.now()}`;

    const createdPRs: PurchaseRequest[] = [];

    // 🔁 3. Loop through cart items and create PR entries
    for (const item of cartItems) {
      const { businessProduct, quantity } = item;
      const price = Number(businessProduct.price);
      const totalAmount = price * quantity;

      // Create PR entry
      let pr = this.prRepo.create({
        prNumber,
        requestedBy: user,
        businessProduct,
        quantity,
        price,
        remarks: `Auto-generated from cart`,
        status: 'PENDING',
      });
      pr = await this.prRepo.save(pr);

      // 4️⃣ Fetch approvers based on total amount
      const configs = await this.configRepo.find({
        where: [
          {
            minAmount: LessThanOrEqual(totalAmount),
            maxAmount: MoreThanOrEqual(totalAmount),
            isActive: true,
          },
          {
            maxAmount: IsNull(),
            minAmount: LessThanOrEqual(totalAmount),
            isActive: true,
          },
        ],
        order: { approvalLevel: 'ASC' },
        relations: ['user'],
      });

      // 🟩 If no approver config found, mark as approved
      if (configs.length === 0) {
        pr.status = 'APPROVED';
        await this.prRepo.save(pr);
      } else {
        let anyPending = false;
        for (const config of configs) {
          await this.approvalRepo.save({
            purchaseRequest: pr,
            approvedBy: config.user,
            approvalLevel: config.approvalLevel,
            status: config.autoApprove ? 'APPROVED' : 'PENDING',
            comments: config.autoApprove
              ? 'Auto approved as per configuration'
              : undefined,
          });

          if (!config.autoApprove) anyPending = true;
        }
        pr.status = anyPending ? 'PENDING' : 'APPROVED';
        await this.prRepo.save(pr);
      }

      createdPRs.push(pr);
    }

    // 🧹 5. Clear user’s cart after creating PRs
    await this.cartRepo.delete({ users: { id: user.id } });

    // ✅ Return all created PRs
    return createdPRs;
  }

  async findAll(queryDto: QueryPurchaseRequestDto) {
    const {
      search,
      requestedBy,
      businessId,
      status,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
    } = queryDto;

    const query = this.prRepo
      .createQueryBuilder('pr')
      .leftJoinAndSelect('pr.requestedBy', 'requestedBy')
      .leftJoinAndSelect('pr.businessProduct', 'bp')
      .leftJoinAndSelect('bp.product', 'product')
      .leftJoinAndSelect('bp.business', 'business')
      .leftJoinAndSelect('pr.approvals', 'approvals');

    if (search) {
      query.andWhere(
        '(pr.prNumber ILIKE :search OR pr.remarks ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (requestedBy)
      query.andWhere('requestedBy.id = :requestedBy', { requestedBy });
    if (businessId) query.andWhere('business.id = :businessId', { businessId });
    if (status) query.andWhere('pr.status = :status', { status });
    if (typeof isActive === 'boolean')
      query.andWhere('pr.isActive = :isActive', { isActive });

    query.skip((page - 1) * limit).take(limit);

    const validSortFields = ['createdAt', 'updatedAt', 'prNumber', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`pr.${sortField}`, order);

    const [records, total] = await query.getManyAndCount();

    return {
      data: records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const pr = await this.prRepo.findOne({
      where: { id },
      relations: [
        'requestedBy',
        'businessProduct',
        'businessProduct.business',
        'businessProduct.product',
        'approvals',
      ],
    });
    if (!pr) throw new NotFoundException('Purchase Request not found');
    return pr;
  }
}
