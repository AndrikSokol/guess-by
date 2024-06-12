import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get<string>('JWT_ACCESS_TOKEN'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_ACCESS_EXPIRESIN'),
    },
  };
};
