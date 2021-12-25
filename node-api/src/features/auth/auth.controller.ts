import {
  Body,
  Controller,
  Post,
  BadRequestException as BadRequest,
  UnauthorizedException as Unauthorized,
  NotFoundException as NotFound,
  UsePipes,
  Res,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';

import { JoiValidationPipe } from '@/internal/pipes';
import { AuthGuard, DuplicateEntityGuard } from '@/internal/guards';
import { cookieOptions } from '@/internal/helpers';

import { LoginDTO, UserRegisterDTO, ArtistRegisterDTO } from './auth.dto';
import { loginSchema, userRegisterSchema, artistRegisterSchema } from './auth.schemas';
import { AuthService } from './auth.service';
import { MailService } from '../mail/mail.service';

@Controller()
export class AuthController {
  constructor(
    private auth: AuthService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  @Post('register/user')
  @UsePipes(new JoiValidationPipe(userRegisterSchema))
  @UseGuards(DuplicateEntityGuard)
  async userRegister(
    @Body() newUser: UserRegisterDTO,
    @Res({ passthrough: true }) response: Response,
    @Req() request,
  ) {
    const ipAddress = request.headers['x-forwarded-for'] || request.ip;
    const { user, token } = await this.auth.createUser({
      ...newUser,
      ipAddress,
    });

    response.cookie('token', token, { ...cookieOptions });

    return {
      message: 'Account created successfully!',
      user,
    };
  }

  @Post('register/artist')
  @UsePipes(new JoiValidationPipe(artistRegisterSchema))
  @UseGuards(DuplicateEntityGuard)
  async artistRegister(
    @Body() newArtist: ArtistRegisterDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { artist, token } = await this.auth.createArtist(newArtist);

    response.cookie('token', token, { ...cookieOptions });

    return {
      message: 'Account created successfully.',
      artist,
    };
  }

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // @UsePipes(new JoiValidationPipe(loginSchema))
  // async login(
  //   @Body() userCredentials: LoginDTO,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const user = await this.userService.getUserByEmail(userCredentials.email);

  //   if (!user) {
  //     throw new NotFound('The user does not exist.');
  //   }

  //   const passwordsMatch = await compare(userCredentials.password, user.password);

  //   if (!passwordsMatch) {
  //     throw new Unauthorized('The password does not match.');
  //   }

  //   const token = sign(
  //     { id: user.id, email: user.email, fullName: user.fullName },
  //     process.env.JWT_SECRET,
  //     {
  //       expiresIn: process.env.JWT_EXPIRY_TIME,
  //     },
  //   );

  //   response.cookie('token', token, { ...cookieOptions });

  //   return {
  //     message: 'Logged in successfully.',
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       fullName: user.fullName,
  //     },
  //   };
  // }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@Req() request: Request & { entity: Record<string, unknown> }) {
    return { entity: request.entity };
  }

  @Get('csrf')
  getCsrfToken(@Req() request: Request) {
    return { csrf: request.csrfToken() };
  }

  @Get('logout')
  @HttpCode(HttpStatus.RESET_CONTENT)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');

    return { message: 'Logged out successfully.' };
  }
}
