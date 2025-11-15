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
  Brackets,
} from 'typeorm';
import { Approval } from '../approval/approval.entity';
import { CartItem } from '../cart/cart-item.entity';
import { Users } from '../users/user.entity';
import { PurchaseRequest } from './purchase-requests.entity';
import { PurchaseRequestItem } from './purchase-request-item.entity';
import { QueryPurchaseRequestDto } from './dto/query-purchase-request.dto';
import { ApprovalConfig } from '../approvalconfig/approval-config.entity';
import { PR_STATUS } from '../common/constants/app.constants';

@Injectable()
export class PRService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,

    @InjectRepository(PurchaseRequestItem)
    private readonly prItemRepo: Repository<PurchaseRequestItem>,

    @InjectRepository(Approval)
    private readonly approvalRepo: Repository<Approval>,

    @InjectRepository(ApprovalConfig)
    private readonly configRepo: Repository<ApprovalConfig>,

    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  /**
   * ✅ Create Purchase Request from all items in user's cart
   */
  async createPurchaseRequestsFromCart(
    user: Users,
  ): Promise<PurchaseRequest | null> {
    const today = new Date();

    // 1️⃣ Get user's cart items
    const cartItems = await this.cartRepo.find({
      where: [
        {
          users: { id: user.id },
          contract: IsNull(),
        },
        {
          users: { id: user.id },
          contract: {
            endDate: MoreThanOrEqual(today),
          },
        },
      ],
      relations: [
        'businessProduct',
        'businessProduct.product',
        'businessProduct.business',
        'contract',
      ],
    });

    if (cartItems.length === 0)
      throw new BadRequestException('Cart is empty — nothing to submit for PR');

    // 2️⃣ Generate PR number + group name
    const timestamp = Date.now();
    const prNumber = `PR-${timestamp}`;

    // 3️⃣ Create PurchaseRequest header
    let purchaseRequest = this.prRepo.create({
      prNumber,
      requestedBy: user,
      remarks: 'Auto-generated from cart',
      status: PR_STATUS.PENDING,
    });
    purchaseRequest = await this.prRepo.save(purchaseRequest);

    // 4️⃣ Create line items
    const requestItems: PurchaseRequestItem[] = [];
    for (const item of cartItems) {
      const { businessProduct, quantity } = item;
      const price = Number(businessProduct.price);
      const totalAmount = price * quantity;

      const prItem = this.prItemRepo.create({
        purchaseRequest,
        businessProduct,
        quantity,
        price,
        status: PR_STATUS.PENDING,
      });
      await this.prItemRepo.save(prItem);

      requestItems.push(prItem);

      // 5️⃣ Approval logic for each line
      const configs = await this.configRepo
        .createQueryBuilder('config')
        .leftJoinAndSelect('config.user', 'user')
        .where('config.isActive = true')
        .andWhere(
          new Brackets((qb) => {
            qb.where(
              ':totalAmount BETWEEN config.minAmount AND config.maxAmount',
            ).orWhere(
              'config.maxAmount IS NULL AND :totalAmount >= config.minAmount',
            );
          }),
        )
        .andWhere('config.groupName = :groupName', {
          groupName: businessProduct.groupName,
        })
        .setParameter('totalAmount', totalAmount)
        .orderBy('config.approvalLevel', 'ASC')
        .getMany();

      if (configs.length === 0) {
        prItem.status = PR_STATUS.APPROVED;
        await this.prItemRepo.save(prItem);
      } else {
        let anyPending = false;
        for (const config of configs) {
          await this.approvalRepo.save({
            prItem,
            approvedBy: config.user,
            approvalLevel: config.approvalLevel,
            status: config.autoApprove ? PR_STATUS.APPROVED : PR_STATUS.PENDING,
            comments: config.autoApprove
              ? 'Auto approved as per configuration'
              : undefined,
          });

          if (!config.autoApprove) anyPending = true;
        }

        prItem.status = anyPending ? PR_STATUS.PENDING : PR_STATUS.APPROVED;
        await this.prItemRepo.save(prItem);
      }
    }

    // 6️⃣ Update overall PR status based on items
    const allApproved = requestItems.every(
      (i) => i.status === PR_STATUS.APPROVED,
    );

    const anyApproved = requestItems.some(
      (i) => i.status === PR_STATUS.APPROVED,
    );

    if (allApproved) {
      purchaseRequest.status = PR_STATUS.APPROVED;
    } else if (anyApproved) {
      purchaseRequest.status = PR_STATUS.PARTIALLY_APPROVED;
    }

    // 7️⃣ Clear user's cart
    await this.cartRepo.delete({ users: { id: user.id } });

    // 8️⃣ Return final PR with items
    return await this.prRepo.findOne({
      where: { id: purchaseRequest.id },
      relations: ['items', 'items.approvals'],
    });
  }

  /**
   * 🔍 Fetch all PRs (with filters)
   */
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
      .leftJoinAndSelect('pr.items', 'items')
      .leftJoinAndSelect('items.businessProduct', 'bp')
      .leftJoinAndSelect('bp.product', 'product');

    if (search) {
      query.andWhere(
        '(pr.prNumber ILIKE :search OR pr.remarks ILIKE :search OR requestedBy.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (businessId)
      query.andWhere('bp.business_id = :businessId', { businessId });

    if (requestedBy)
      query.andWhere('requestedBy.id = :requestedBy', { requestedBy });
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

  /**
   * 🔍 Find single PR with items + approvers
   */
  async findOne(id: number) {
    const pr = await this.prRepo.findOne({
      where: { id },
      relations: [
        'requestedBy',
        'items',
        'items.businessProduct',
        'items.businessProduct.business',
        'items.businessProduct.product',
        'items.approvals',
      ],
    });
    if (!pr) throw new NotFoundException('Purchase Request not found');
    return pr;
  }
}
