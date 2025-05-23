import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/createUserDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @Post('email/login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Post('email/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects to Google OAuth
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    return this.authService.googleAuthRedirect(req.user, res);
  }

  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  getProtected(@Req() req: any) {
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }
}
