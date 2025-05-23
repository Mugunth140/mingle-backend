import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProviderEnum } from '../../helpers/userProvider.Enum';
import { AuthUserDto } from '../dto/authUser.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL;

    if (!clientID || !clientSecret || !callbackURL) {
      throw new NotFoundException('Missing Google OAuth2.0 credentials');
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // console.log('Google profile:', profile);
    const { id, name, emails, photos } = profile;
    const user: AuthUserDto = {
      username: name.givenName,
      email: emails[0].value,
      password: '',
      profilePic: photos[0].value,
      provider: UserProviderEnum.GOOGLE,
      providerId: id,
    };
    done(null, user);
  }
}
