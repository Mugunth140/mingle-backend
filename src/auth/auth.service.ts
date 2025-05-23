import {
  ConflictException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User} from '../user/entity/user.entity';
import { UserProviderEnum } from '../helpers/userProvider.Enum';
import { Repository } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { hashPassword } from 'src/utils/hashPassword.util';

@Injectable()
export class AuthService {
  private readonly oAuth2Client: OAuth2Client;
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    // this.oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(user: CreateUserDto) {
    const userExists = await this.usersRepository.findOneBy({
      email: user.email,
      username: user.username,
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await hashPassword(user.password);
    const entity = this.usersRepository.create({
      username: user.username,
      email: user.email,
      password: hashedPassword,
      profilePic: '',
      provider: UserProviderEnum.EMAIL,
      providerId: '',
    });
    return {
      message: 'User created successfully',
      user: await this.usersRepository.save(entity),
    };
  }

async googleAuthRedirect(req: User, res: any): Promise<any> {
  try {
    let user = await this.usersRepository.findOneBy({ email: req.email });

    if (!user) {
       user = this.usersRepository.create({
        username: req.username,
        email: req.email,
        password: '', // Leave blank for OAuth users
        profilePic:
          req.profilePic ||
          process.env.DEFAULT_PROFILE_PIC ||
          'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106',
        provider: UserProviderEnum.GOOGLE,
        providerId: req.providerId,
      });

      await this.usersRepository.save(user);
    }

    const accessToken = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    const frontendRedirectUrl = process.env.FRONTEND_REDIRECT_URL; // e.g., https://yourfrontend.com/auth/success

    const queryParams = new URLSearchParams({
      token: accessToken,
      username: user.username,
      email: user.email,
    });

    return res.redirect(`${frontendRedirectUrl}?${queryParams.toString()}`);
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw new UnauthorizedException('Error validating Google token');
  }
}


  async validate(idToken: string): Promise<any> {
    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken,
        audience: 'GOOGLE_CLIENT_ID',
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        displayName: payload.name,
      };
    } catch (error) {
      throw new UnauthorizedException('Error validating Google token');
    }
  }

    generateAccessToken(user: User): { access_token: string } {
    const payload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
