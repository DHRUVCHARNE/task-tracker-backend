import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Ensure this is correctly set in .env
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
