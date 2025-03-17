import { prop } from '@typegoose/typegoose';
import { TopLevelCategory } from '../top-page.model/top-page.model';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HhDataDto {
  @ApiProperty({ example: 100, description: 'Количество вакансий' })
  @IsNumber()
  count: number;

  @ApiProperty({ example: 60000, description: 'Зарплата джуниора' })
  @IsNumber()
  juniorSalary: number;

  @ApiProperty({ example: 120000, description: 'Зарплата мидла' })
  @IsNumber()
  middleSalary: number;

  @ApiProperty({ example: 200000, description: 'Зарплата сеньора' })
  @IsNumber()
  seniorSalary: number;

  @ApiProperty({
    example: '2024-03-17T12:00:00.000Z',
    description: 'Дата обновления',
  })
  @IsDate()
  updatedAt: Date;
}

export class TopPageAdvantageDto {
  @ApiProperty({
    example: 'Гибкий график',
    description: 'Название преимущества',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Вы можете работать удаленно',
    description: 'Описание преимущества',
  })
  @IsString()
  description: string;
}

export interface TopPageModel {}

export class CreateTopPageDto {
  @ApiProperty({
    example: 0,
    enum: TopLevelCategory,
    description: 'Первая категория',
  })
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;
  @Type(() => Number)
  @ApiProperty({ example: 'Frontend', description: 'Вторая категория' })
  @IsString()
  secondCategory: string;

  @ApiProperty({ example: 'react-course', description: 'Алиас страницы' })
  @IsString()
  alias: string;

  @ApiProperty({ example: 'Курс по React', description: 'Название страницы' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Программирование',
    description: 'Категория страницы',
  })
  @IsString()
  category: string;

  @ApiProperty({
    type: HhDataDto,
    required: false,
    description: 'Данные по зарплатам',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => HhDataDto)
  hh?: HhDataDto;

  @ApiProperty({ type: [TopPageAdvantageDto], description: 'Преимущества' })
  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvantageDto)
  advantages: TopPageAdvantageDto[];

  @ApiProperty({ example: '<h1>SEO текст</h1>', description: 'SEO текст' })
  @IsString()
  seoText: string;

  @ApiProperty({ example: 'Лучшие курсы', description: 'Заголовки тегов' })
  @IsString()
  tagsTitles: string;

  @ApiProperty({ example: ['React', 'NestJS'], description: 'Теги' })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
