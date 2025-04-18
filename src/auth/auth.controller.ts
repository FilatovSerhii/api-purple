import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  HttpCode,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return await this.authService.createUser(dto);
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { email } = await this.authService.validateUser(login, password);
    return this.authService.login(email);
  }
}
