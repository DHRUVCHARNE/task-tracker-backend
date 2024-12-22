import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtPassportStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(JwtPassportStrategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,  // Inject ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract JWT from Authorization header
      ignoreExpiration: false,  // Check JWT expiration
      secretOrPrivateKey: configService.get<string>('JWT_SECRET'),  // Get the secret from environment via ConfigService
      secretOrKey: configService.get<string>('JWT_SECRET'),  // Get the secret from environment via ConfigService
      
    });
  }

  async validate(payload: any) {
    console.log('Decoded JWT Payload:', payload);  // Debugging log
    const user = await this.usersService.findById(payload.sub);  // Use the 'sub' field for user ID
    console.log('User from JWT:', user);  // Debugging log
    if (!user) {
      throw new UnauthorizedException();
    }
    return {userId: user._id.toHexString() }; // This adds the user to the request object
  }
}
