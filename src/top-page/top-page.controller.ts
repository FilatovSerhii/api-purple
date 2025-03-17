import { TopPageService } from './top-page.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TopPageModel } from './top-page.model/top-page.model';
import { FindTopPageDTO } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';
import { NOT_FOUND_TOP_PAGE_ERROR } from './dto/top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('TopPage')
@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новую страницу' })
  @ApiResponse({ status: 201, description: 'Страница успешно создана' })
  @ApiBody({ type: CreateTopPageDto })
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить страницу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Страница найдена',
    type: TopPageModel,
  })
  @ApiResponse({ status: 404, description: 'Страница не найдена' })
  @ApiParam({ name: 'id', description: 'Идентификатор страницы' })
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.findById(id);
    if (!page) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return page;
  }

  @ApiOperation({ summary: 'Получить страницу по alias' })
  @ApiResponse({
    status: 200,
    description: 'Страница найдена',
    type: TopPageModel,
  })
  @ApiResponse({ status: 404, description: 'Страница не найдена' })
  @ApiParam({ name: 'alias', description: 'Алиас страницы' })
  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.findByAlias(alias);
    if (!page) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return page;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить страницу по ID' })
  @ApiResponse({ status: 200, description: 'Страница удалена' })
  @ApiResponse({ status: 404, description: 'Страница не найдена' })
  @ApiParam({ name: 'id', description: 'Идентификатор страницы' })
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this.topPageService.deleteById(id);
    if (!deletedPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
  }

  @ApiOperation({ summary: 'Обновить страницу по ID' })
  @ApiResponse({
    status: 200,
    description: 'Страница обновлена',
    type: TopPageModel,
  })
  @ApiResponse({ status: 404, description: 'Страница не найдена' })
  @ApiParam({ name: 'id', description: 'Идентификатор страницы' })
  @ApiBody({ type: CreateTopPageDto })
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatePage = await this.topPageService.updateById(id, dto);
    if (!updatePage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
  }

  @ApiOperation({ summary: 'Найти страницы по категории' })
  @ApiResponse({
    status: 200,
    description: 'Результаты поиска',
    type: [TopPageModel],
  })
  @ApiBody({ type: FindTopPageDTO })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDTO) {
    return await this.topPageService.findByCategory(dto.firstCategory);
  }
}
