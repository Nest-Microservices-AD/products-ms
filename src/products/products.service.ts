import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('ProductService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const total = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(total / limit);
    const data = await this.product.findMany({
      where: { available: true },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data,
      pagination: {
        page,
        total,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });
    if (!product) {
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);
    return this.product.update({
      where: { id, available: true },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.product.update({ where: { id }, data: { available: false } });
  }

  async validate(ids: number[]) {
    ids = Array.from(new Set(ids));
    const products = await this.product.findMany({
      where: { id: { in: ids } },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: 'Some products are not valid',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return products;
  }
}
