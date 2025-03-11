import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  descriptions: string;
  @Max(5)
  @Min(1, { message: 'The rating cannot be less than 1' })
  @IsNumber()
  rating: number;

  @IsString()
  productId: string;
}
