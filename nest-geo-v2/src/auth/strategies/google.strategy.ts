import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('CLIENT_GOOGLE_ID'),
      clientSecret: configService.get('CLIENT_GOOGLE_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, id } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName === undefined ? null : name.givenName,
      lastName: name.familyName === undefined ? null : name.familyName,
      username: profile.username || name.givenName,
    };
    done(null, user);
  }
}
