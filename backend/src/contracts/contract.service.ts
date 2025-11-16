import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { Contract } from './contract.entity';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { Users } from '../users/user.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { GetContractsDto } from './dto/get-contracts.dto';
import {
  CONTRACT_DEFAULT_YEAR,
  PR_STATUS,
} from '../common/constants/app.constants';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,

    @InjectRepository(PurchaseRequest)
    private readonly prRepo: Repository<PurchaseRequest>,

    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
  ) {}

  async createContractFromPR(
    dto: CreateContractDto,
    imagePaths: string | null,
  ) {
    const { prNumber, items = [] } = dto;

    // 1️⃣ Find PR with items
    const purchaseRequest = await this.prRepo.findOne({
      where: {
        prNumber,
        status: In([PR_STATUS.APPROVED, PR_STATUS.PARTIALLY_APPROVED]),
      },
      relations: [
        'items',
        'items.businessProduct',
        'items.businessProduct.business',
        'requestedBy',
      ],
    });

    if (!purchaseRequest) {
      throw new NotFoundException(
        `Purchase Request ${prNumber} not found or not approved`,
      );
    }
    const contractLink = imagePaths || null;

    // 2️⃣ Filter only APPROVED items
    const approvedItems = purchaseRequest.items.filter(
      (item) => item.status === PR_STATUS.APPROVED,
    );
    if (approvedItems.length === 0)
      throw new BadRequestException('No approved items found for this PR');

    for (const item of approvedItems) {
      const requestItem = items.find((i) => i.itemId === item.id);
      const buyerId = purchaseRequest.requestedBy.id;
      const bpId = item.businessProduct.id;

      // DEFAULT END DATE = TODAY + 1 YEAR
      const defaultEndDate = new Date();
      defaultEndDate.setFullYear(
        defaultEndDate.getFullYear() + CONTRACT_DEFAULT_YEAR,
      );

      // VALUES BASED ON REQUEST OR DEFAULTS
      const price = requestItem?.price ?? item.price;
      const endDate = requestItem?.endDate
        ? new Date(requestItem.endDate)
        : defaultEndDate;
      const isActive = requestItem?.isActive ?? true;

      // Check existing contract
      let contract = await this.contractRepo.findOne({
        where: {
          prNumber,
          buyer: { id: buyerId },
          businessProduct: { id: bpId },
        },
        relations: ['buyer', 'businessProduct'],
      });

      if (contract) {
        // UPDATE
        contract.business = item.businessProduct.business;
        contract.price = price;
        contract.contractslink = contractLink;
        contract.endDate = endDate;
        contract.isActive = isActive;

        await this.contractRepo.save(contract);
      } else {
        // CREATE
        contract = this.contractRepo.create({
          prNumber,
          buyer: purchaseRequest.requestedBy,
          businessProduct: item.businessProduct,
          business: item.businessProduct.business,
          price: price,
          contractslink: contractLink,
          startDate: new Date(),
          endDate: endDate,
          isActive: isActive,
        });

        await this.contractRepo.save(contract);
      }
    }
    return null;
  }

  async getAllContracts(dto: GetContractsDto) {
    const {
      page,
      limit,
      sortBy,
      sortOrder,
      businessId,
      userId,
      isActive,
      search,
    } = dto;

    const take = Math.min(limit, 100);
    const skip = (page - 1) * take;

    const qb: SelectQueryBuilder<Contract> = this.contractRepo
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.business', 'business')
      .leftJoinAndSelect('contract.buyer', 'buyer')
      .leftJoinAndSelect('contract.businessProduct', 'bp')
      .leftJoinAndSelect('bp.product', 'product');

    // 🔹 Filters
    if (businessId) qb.andWhere('business.id = :businessId', { businessId });
    if (userId) qb.andWhere('buyer.id = :userId', { userId });
    if (isActive !== undefined)
      qb.andWhere('contract.isActive = :isActive', { isActive });

    // 🔹 Search (by PR number or contract link)
    if (search) {
      qb.andWhere(
        `(contract.prNumber ILIKE :search OR contract.contractslink ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    // 🔹 Sorting
    const validSortFields = ['createdAt', 'price', 'startDate', 'endDate'];
    const orderField = validSortFields.includes(sortBy)
      ? `contract.${sortBy}`
      : 'contract.createdAt';
    qb.orderBy(orderField, sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC');

    // 🔹 Pagination
    qb.skip(skip).take(take);

    // 🔹 Execute query
    const [contracts, total] = await qb.getManyAndCount();

    return {
      data: contracts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const record = this.contractRepo
      .createQueryBuilder('contract')
      .leftJoinAndSelect('contract.business', 'business')
      .leftJoinAndSelect('contract.buyer', 'buyer')
      .leftJoinAndSelect('contract.businessProduct', 'bp')
      .leftJoinAndSelect('bp.product', 'product')
      .where('contract.id = :id', { id })
      .getOne();
    // ✅ Handle not found
    if (!record) {
      throw new NotFoundException('Product not found');
    }
    return record;
  }
}
