import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create' })
  create(@Payload() createProductDto: CreateProductDto) {
    try {
      return this.productsService.create(createProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'find_all' })
  findAll(@Payload() paginationDto: PaginationDto) {
    try {
      return this.productsService.findAll(paginationDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'find_one' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    try {
      return this.productsService.findOne(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'update' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    try {
      return this.productsService.update(updateProductDto.id, updateProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'delete' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    try {
      return this.productsService.remove(id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'validate' })
  validateProducts(@Payload() ids: number[]) {
    try {
      return this.productsService.validate(ids);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
