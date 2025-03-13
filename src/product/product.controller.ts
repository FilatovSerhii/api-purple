import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { ProductModel } from './product.model/product.model';
import { FindProductDTO } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const product = await this.productService.findById(id);
    if(!product){
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return product
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedProduct = await this.productService.deleteById(id);
    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }

  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: CreateProductDto) {
     const updatedProduct = await this.productService.updateById(id, dto);
     if (!updatedProduct) {
       throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
     }
     return updatedProduct;
  }

  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindProductDTO) {}
}
