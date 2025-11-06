import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Contract } from './contract.entity';
import { PurchaseRequest } from '../pr/purchase-requests.entity';
import { Users } from '../users/user.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { GetContractsDto } from './dto/get-contracts.dto';

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
    const { prNumber } = dto;

    // 1️⃣ Find PR with items
    const pr = await this.prRepo.findOne({
      where: { prNumber },
      relations: [
        'items',
        'requestedBy',
        'items.businessProduct',
        'items.businessProduct.business',
      ],
    });

    if (!pr) throw new NotFoundException('Purchase Request not found');

    // 2️⃣ Filter only APPROVED items
    const approvedItems = pr.items.filter((item) => item.status === 'APPROVED');
    if (approvedItems.length === 0)
      throw new BadRequestException('No approved items found for this PR');

    // 3️⃣ Set contract link if uploaded
    const contractLink = imagePaths || null;

    // 4️⃣ Prepare contracts
    const contractsToSave: Contract[] = approvedItems.map((item) => {
      const contract = new Contract();
      contract.prNumber = prNumber;
      contract.buyer = pr.requestedBy;
      contract.business = item.businessProduct?.business;
      contract.businessProduct = item.businessProduct;
      contract.price = item.price;
      contract.contractslink = contractLink;
      contract.startDate = new Date();
      contract.endDate = dto.endDate ? new Date(dto.endDate) : null; // ✅ Added
      contract.isActive = true;
      return contract;
    });

    // 5️⃣ Save all contracts at once
    const savedContracts = await this.contractRepo.save(contractsToSave);

    return savedContracts;
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
      .leftJoinAndSelect('contract.businessProduct', 'bp');

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
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}
