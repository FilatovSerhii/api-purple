import { Body, Controller, Delete, Post, Param, Get } from '@nestjs/common';
import { ProductModel } from 'src/product/product.model/product.model';
import { ReviewModel } from './review.model/review.model';

@Controller('review')
export class ReviewController {
  @Post('create')
  async create(@Body() dto: Omit<ReviewModel, '_id'>) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}
  @Get('byProduct/:productId')
  async getByProduct(@Param('productId') productId: string) {

	}
}
