import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { BearerStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { CoreModule } from '../core/core.module';
import { MailService } from '../core/mail/mail.service';

@Module({
  imports: [
    UsersModule,
    CoreModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'Secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  providers: [AuthService, BearerStrategy, UsersService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
