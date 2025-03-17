import { TelegramService } from './../telegram/telegram.service';
import {
  Body,
  Controller,
  Delete,
  Post,
  Param,
  Get,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly TelegramService: TelegramService,
  ) {}
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  // @Cron(CronExpression.EVERY_DAY_AT_6PM, { name: 'crone' })
  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message = `Name ${dto.name}\n
    + 'Title: '${dto.title}\n
    + 'Description: '${dto.descriptions}\n
    + 'Rating: '${dto.rating}\n
    + 'Product Id: '${dto.productId}
    `;
    return this.TelegramService.sendMessage(message);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleteDoc = await this.reviewService.delete(id);
    if (!deleteDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId', IdValidationPipe) productId: string,
    @UserEmail() email: string,
  ) {
    console.log('email', email);
    return this.reviewService.findByProductId(productId);
  }
}
