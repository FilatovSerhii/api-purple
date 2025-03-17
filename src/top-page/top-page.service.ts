import { CreateTopPageDto } from './dto/create-top-page.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {
  TopLevelCategory,
  TopPageModel,
} from './top-page.model/top-page.model';

import { addDays } from 'date-fns';

@Injectable()
export class TopPageService {
  constructor(
    // @ts-ignore
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    // return await this.topPageModel.create(dto);
    try {
      return await this.topPageModel.create(dto);
    } catch (error) {
      throw new BadRequestException(
        'Ошибка создания страницы: ' + error.message,
      );
    }
  }

  async findById(id: string) {
    return await this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return await this.topPageModel.findOne({ alias }).exec();
  }

  async deleteById(id: string) {
    return await this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return await this.topPageModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return await this.topPageModel
      .find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
      .exec();
  }

  async findForHhUpdate(date: Date) {
    return await this.topPageModel
      .find({
        firstCategory: 0,
        'hh.updateAt': { $lt: addDays(date, -1) },
      })
      .exec();
  }
}
