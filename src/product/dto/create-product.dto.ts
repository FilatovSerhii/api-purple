import { Type } from 'class-transformer';
import { IsNumber, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';

class ProductCharacteristicsDTO {
  @IsString()
  name: string;
  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  oldPrice?: number;

  @IsNumber()
  credit: number;

  @IsString()
  description: string;

  @IsString()
  advantages: string;

  @IsString()
  disAdvantages: string;

  @IsString({ each: true })
  categories: string[];

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductCharacteristicsDTO)
  characteristics: ProductCharacteristicsDTO[];
}
