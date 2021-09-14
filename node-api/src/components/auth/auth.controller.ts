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
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';

import { JoiValidationPipe } from 'src/utils/joi.pipe';
import { SigninDTO, SignupDTO } from './auth.dto';
import { signinSchema, signupSchema } from './auth.schemas';

import { AuthService } from './auth.service';
import { AuthGuard } from 'src/utils/auth.guard';
import { cookieOptions } from 'src/utils/cookie';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new JoiValidationPipe(signupSchema))
  async signup(
    @Body() { name, password, email }: SignupDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const hashedPassword = await hash(password, 10);

    const user = await this.authService.signup({
      name,
      password: hashedPassword,
      email,
    });

    if (!user) {
      throw new BadRequest(
        'Something went wrong while trying to create the user, try again.',
      );
    }

    const token = sign({ user }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    });

    response.cookie('token', token, cookieOptions);

    return {
      message: 'Account created successfully.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  @Post('signin')
  @UsePipes(new JoiValidationPipe(signinSchema))
  async signin(
    @Body() userCredentials: SigninDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.getUserByEmail(userCredentials.email);

    if (!user) {
      throw new NotFound('The user does not exist.');
    }

    const passwordsMatch = await compare(
      userCredentials.password,
      user.password,
    );

    if (!passwordsMatch) {
      throw new Unauthorized('The password does not match.');
    }

    const token = sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY_TIME,
      },
    );

    response.cookie('token', token, cookieOptions);

    return {
      message: 'Signed in successfully.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  @Get('csrf')
  getCsrfToken(@Req() request: Request) {
    return { csrf: request.csrfToken() };
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  test(@Req() request: Request & { user: Record<string, unknown> }) {
    return { user: request.user };
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');

    return { message: 'Logged out successfully.' };
  }
}
