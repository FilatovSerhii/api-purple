import { IsEnum } from 'class-validator';
import { TopLevelCategory } from '../top-page.model/top-page.model';

export class FindTopPageDTO {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;
}